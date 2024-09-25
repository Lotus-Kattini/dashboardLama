import React from 'react';
import { Link } from 'react-router-dom';

function SidebarCard({ title, link, icon: Icon, image }) {
  return (
    <Link to={link} className="sidebar-card">
      <div className="sidebar-card-image" style={{ backgroundImage: `url(${image})` }}>
        <div className="sidebar-card-content">
          <Icon size={64} className="sidebar-card-icon" />
          <h3>{title}</h3>
          <button className="sidebar-card-button">Go to {title}</button>
        </div>
      </div>
    </Link>
  );
}

export default SidebarCard;
