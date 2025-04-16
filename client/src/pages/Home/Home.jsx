import { useEffect } from 'react';
import { Featured, Slide, TrustedBy } from '../../components';
import { CategoryCard, ProjectCard } from '../../components';
import { cards, projects } from '../../data';

import './Home.scss';

const Home = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  return (
    <div className='home'>
      <Featured />
      <TrustedBy />
      <Slide slidesToShow={5}>
        {
          cards.map((card) => (
            <CategoryCard key={card.id} data={card} />
          ))
        }
      </Slide>
      <div className="features">
        <div className="container">
          <div className="item">
            <h1>Dəstək ola biləcək ekspertlər bir ekran yaxınlığında</h1>
            <div className="title">
              <img src="./media/check.png" alt="check" />
              <h6>Hər büdcəyə uyğun</h6>
            </div>
            <p>Yüksək keyfiyyətli xidmətləri uyğun qiymət aralıqlarında tap.</p>
            <div className="title">
              <img src="./media/check.png" alt="check" />
              <h6>Sürətlə edilən keyfiyyətli iş</h6>
            </div>
            <p>Sənə dəstək ola biləcək düzgün mentoru dəqiqələr içində tap.</p>
            <div className="title">
              <img src="./media/check.png" alt="check" />
              <h6>Təhlükəsiz ödənişlər, hər zaman</h6>
            </div>
            <p>Hər zaman nə qədər ödəyəcəyini əvvəlcədən bilmə imkanı. İşi təsdiqlədikdən sonra ödəniş edə bilmə imkanı.</p>
            <div className="title">
              <img src="./media/check.png" alt="check" />
              <h6>24/7 dəstək</h6>
            </div>
            <p>Suallar yarandı? Bizim dəstək komandamız hər yerdə, hər zaman suallarınızı cavablamağa hazırdır.</p>
          </div>
          <div className="item">
            <img 
              src="https://cdn.pixabay.com/photo/2017/08/15/12/04/helping-each-other-2643652_1280.jpg" 
              alt="Bir-birinə yardım etmək" 
              style={{ width: '720px', height: '461px' }} 
            />
          </div>
        </div>
      </div>

      <Slide slidesToShow={4}>
        {
          projects.map((card) => (
            <ProjectCard key={card.id} data={card} />
          ))
        }
      </Slide>
    </div>
  )
}

export default Home