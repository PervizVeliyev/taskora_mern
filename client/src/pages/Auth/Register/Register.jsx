import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosFetch, generateImageURL } from '../../../utils';
import './Register.scss'

const Register = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formInput, setFormInput] = useState({
    username: "",
    email: "",
    password: "",
    phone: '',
    description: '',
    isSeller: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (let key in formInput) {
      if (formInput[key] === '') {
        toast.error('Zəhmət olmasa, məcburi xanaları daxil edin: ' + key);
        return;
      }
      else if (key === 'phone' && formInput[key].length < 9) {
        toast.error('Düzgün mobil nömrə daxil edin, zəhmət olmasa!');
        return;
      }
    }

    setLoading(true);
    try {
      const url = await generateImageURL(image);
      console.log(formInput);
      console.log(url);
      const { data } = await axiosFetch.post('/auth/register', { ...formInput, image: url });
      toast.success('Qeydiyyat uğurla tamamlandı!');
      setLoading(false);
      navigate('/login');
    }
    catch ({ response }) {
      toast.error(response.data.message);
      setLoading(false);
    }
  }

  const handleChange = (event) => {
    const { value, name, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormInput({
      ...formInput,
      [name]: inputValue
    });
  }

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Yeni hesab yarat</h1>
          <label htmlFor="">İstifadəçi adı <span style={{ color: '#757575' }}>*</span></label>
          <input
            name="username"
            type="text"
            placeholder="parvizvaliyev"
            onChange={handleChange}
          />
          <label htmlFor="">Mail ünvanı <span style={{ color: '#757575' }}>*</span></label>
          <input
            name="email"
            type="email"
            placeholder="test@gmail.com"
            onChange={handleChange}
          />
          <label htmlFor="">Şifrə <span style={{ color: '#757575' }}>*</span></label>
          <input name="password" type="password" onChange={handleChange} />
          <label htmlFor="">Profil şəkli <span style={{ color: '#757575' }}>*</span></label>
          <input type="file" onChange={(event) => setImage(event.target.files[0])} />
          <button type="submit" disabled={loading}>{loading ? 'Yüklənir...' : 'Qeydiyyat'}</button>
        </div>
        <div className="right">
          <p>Hesabın var? <Link to='/login'>Daxil ol</Link></p>
          <h1>Satıcı olmaq istəyirəm</h1>
          <div className="toggle">
            <label htmlFor="">Satıcı hesabını aktivləşdir</label>
            <label className="switch">
              <input type="checkbox" name='isSeller' onChange={handleChange} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Telefon nömrəsi <span style={{ color: '#757575' }}>*</span></label>
          <input
            name="phone"
            type="text"
            placeholder="+1 1234 567 890"
            onChange={handleChange}
          />
          <label htmlFor="">Məlumat <span style={{ color: '#757575' }}>*</span></label>
          <textarea
            placeholder="Özün haqqında qısa məlumat"
            name="description"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  )
}

export default Register