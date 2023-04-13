import Menu from './Menu';
import '../style.css';

interface LayoutProps {
  title: string;
  description: string;
  className: string;
  children: React.ReactNode;
}

function Layout({
  title = 'Title',
  description = 'Description',
  className,
  children,
}: LayoutProps) {
  return (
    <div className="container-fluid pl-0 pr-0">
      <Menu />
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h2 className="display-5">{title}</h2>
          <p className="col-md-8 fs-4">{description}</p>
        </div>
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}

export default Layout;
