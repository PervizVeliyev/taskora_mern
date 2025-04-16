import { useEffect } from 'react';
import './Footer.scss';

const Footer = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='footer'>
      <div className="container">
        <div className="top">
          <div className="item">
            <h1>Kateqoriyalar</h1>
            <span>Qrafika və Dizayn</span>
            <span>Rəqəmsal Marketinq</span>
            <span>Yazı və Tərcümə</span>
            <span>Video və Animasiya</span>
            <span>Musiqi və Səs</span>
            <span>Proqramlaşdırma və Texnologiya</span>
            <span>Databaza</span>
            <span>Biznes</span>
            <span>Həyat Tərzi</span>
            <span>Fotoqrafiya</span>
            <span>Xəritə</span>
          </div>
          <div className="item">
            <h1>Haqqında</h1>
            <span>Karyera</span>
            <span>Prez və Xəbərlər</span>
            <span>Partnyorluq</span>
            <span>Gizlilik Siyasəti</span>
            <span>Xidmət Şərtləri</span>
            <span>İntellektual Mülkiyyət Haqları</span>
            <span>İnvestor Əlaqələri</span>
          </div>
          <div className="item">
            <h1>Dəstək</h1>
            <span>Yardım və Dəstək</span>
            <span>Etibar və Təhlükəsizlik</span>
            <span>Taskora-da Satış</span>
            <span>Taskora-da Alış</span>
          </div>
          <div className="item">
            <h1>İcma</h1>
            <span>Hadisələr</span>
            <span>Bloq</span>
            <span>Forum</span>
            <span>İcma Standartları</span>
            <span>Podkast</span>
            <span>Dostu Dəvət Et</span>
          </div>
          <div className="item">
            <h1>Taskora-dan Daha Çox</h1>
            <span>Taskora Biznes</span>
            <span>Taskora Pro</span>
            <span>Taskora Studios</span>
            <span>Taskora Loqo Yaradıcı</span>
            <span>Taskora Guild</span>
            <span>İlham Alın</span>
            <span>Öyrən</span>
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <h2>taskora</h2>
            <span>© Taskora International Ltd. {new Date().getFullYear()}</span>
          </div>
          <div className="right">
            <div className="social">
              <img src="./media/twitter.png" alt="" />
              <img src="./media/facebook.png" alt="" />
              <img src="./media/linkedin.png" alt="" />
              <img src="./media/pinterest.png" alt="" />
              <img src="./media/instagram.png" alt="" />
            </div>
            <div className="link">
              <img src="./media/language.png" alt="" />
              <span>Azərbaycan</span>
            </div>
            <div className="link">
              <img src="./media/coin.png" alt="" />
              <span>AZN</span>
            </div>
            <div className="link">
              <img src="./media/accessibility.png" alt="" />
              <span>AZN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer