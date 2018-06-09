
# import raven

from .base import *
from .secrets import db_password, raven_dsn, mailgun_smtp_password


SITE_DOMAIN = 'www.spendwell.co'
ALLOWED_HOSTS = [SITE_DOMAIN]

django_heroku.settings(locals())

# DATABASES['default'] = {
#     'ENGINE': 'django.db.backends.postgresql_psycopg2',
#     'HOST': '172.16.87.148',
#     'NAME': 'spendwell',
#     'USER': 'spendwell',
#     'PASSWORD': db_password,
# }

# INSTALLED_APPS.append('raven.contrib.django.raven_compat')

# MIDDLEWARE_CLASSES.append(
#     'raven.contrib.django.raven_compat.middleware.SentryResponseErrorIdMiddleware'
# )


# CACHES['default']['LOCATION'] = 'redis://172.16.87.154:6379/1'
# BROKER_URL = 'redis://172.16.87.154:6379/0'


# LOGGING['handlers']['sentry'] = {
#     'level': 'ERROR',
#     'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
# }
# LOGGING['loggers']['django']['handlers'] = ['console', 'sentry']


EMAIL_HOST_PASSWORD = mailgun_smtp_password


# RAVEN_PUBLIC_DSN = 'https://e82e41c7ae084a72b64d0571f6b4dcfd@app.getsentry.com/73495'
# RAVEN_CONFIG = {
#     'dsn': raven_dsn,
#     'release': raven.fetch_git_sha(BASE_DIR),
# }

INCLUDE_ANALYTICS = True
MIXPANEL_PUBLIC_KEY = '25e4cbc88d444229cfcddfe21935ed2c'
GOOGLE_ANALYTICS_KEY = 'UA-71571230-1'
FACEBOOK_PIXEL_KEY = '227041677640062'

# Needed for weekly email
CHARTURL_API_KEY = None
