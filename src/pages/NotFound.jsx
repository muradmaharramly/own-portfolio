import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__code">404</h1>
        <h2 className="not-found__title">Səhifə tapılmadı</h2>
        <p className="not-found__text">
          Axtardığınız səhifə mövcud deyil və ya yeri dəyişdirilib.
        </p>
        <Link to="/" className="not-found__button">
          <FaHome /> Ana Səhifəyə Qayıt
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
