import { Link } from "react-router";
import "./AdminPageHeader.css";

export default function AdminPageHeader({ title, addLink, addLabel }) {
  return (
    <div className="admin-page-header">
      <h1 className="admin-page-title">{title}</h1>
      {addLink && (
        <Link to={addLink} className="btn btn-primary btn-sm">
          <i className="ti ti-plus" aria-hidden="true"></i> {addLabel}
        </Link>
      )}
    </div>
  );
}
