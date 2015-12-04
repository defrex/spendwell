
import { Link } from 'react-router';


export default (props)=> {
  const { className, variant, raised, ...extraProps } = props;

  let classes = className || '';
  classes += ' mui-btn';
  if (variant)
    classes += ` mui-btn--${variant}`;
  if (raised)
    classes += ` mui-btn--raised`;

  if (props.to)
    return <Link className={classes} {...extraProps}/>;
  else
    return <button className={classes} {...extraProps}/>;
};