
from django import forms
from django.core.urlresolvers import reverse
from django.utils.html import format_html
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as AuthUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from spendwell.admin import admin_site
from .models import User, BetaCode, BetaSignup


class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email',)

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ('email', 'password', 'is_active', 'is_admin')

    def clean_password(self):
        return self.initial.get('password')


class UserAdmin(AuthUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('email', 'is_admin')
    list_filter = ('is_admin',)
    fieldsets = ((None, {'fields': (
        'email',
        'email_subscribed',
        'is_admin',
        'finicity_id',
        'estimated_income',
        'timezone',
        'last_sync',
    )}),)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()


admin_site.register(User, UserAdmin)


class BetaCodeAdmin(admin.ModelAdmin):
    list_display = ('key', 'created', 'intended_for', 'used_by', 'used')
    readonly_fields = ('used_by',)

admin_site.register(BetaCode, BetaCodeAdmin)


class BetaSignupAdmin(admin.ModelAdmin):
    list_display = ('email', 'created', 'invited', 'used')
    readonly_fields = ('used', 'invite_url', 'beta_code_link')
    raw_id_fields = ('beta_code',)
    fields = ('email', 'used', 'invite_url', 'beta_code_link', 'beta_code')
    actions = ('invite_user', 'invite_user_email',)

    def invite_user(self, request, queryset, email=False):
        invited = sum([beta_signup.invite_user(email=email) for beta_signup in queryset])
        self.message_user(request, '{} beta codes generated'.format(invited))
    invite_user.short_description = 'Invite'

    def invite_user_email(self, request, queryset):
        return self.invite_user(request, queryset, email=True)
    invite_user_email.short_description = 'Invite & Email'

    def invite_url(self, beta_signup):
        return beta_signup.beta_code.invite_url
    invite_url.short_description = 'Invite URL'

    def beta_code_link(self, beta_signup):
        if not beta_signup.beta_code:
            return ''
        return format_html(
            '<a href="{}">Beta Code</a>',
            reverse('admin:users_betacode_change', args=(beta_signup.beta_code.id,)),
        )
    beta_code_link.short_description = 'Beta Code'

admin_site.register(BetaSignup, BetaSignupAdmin)
