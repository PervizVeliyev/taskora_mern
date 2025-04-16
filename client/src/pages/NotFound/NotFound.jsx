import './NotFound.scss';

const NotFound = () => {
  return (
    <div className='notFound'>
      <div className='container'>
        <h1>404</h1>
        <div className='text'>
          <h2>Səhifə tapılmadı</h2>
          <p>Üzr istəyirik, axtardığınız səhifəni tapa bilmədik.</p>
        </div>
      </div>
    </div>
  )
}

export default NotFound;