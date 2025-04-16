import toast from 'react-hot-toast';
import { useEffect, useReducer, useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { gigReducer, initialState } from '../../reducers/gigReducer';
import { cards } from '../../data';
import { axiosFetch, generateImageURL } from '../../utils';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atoms';
import './Add.scss';

const Add = () => {
  const user = useRecoilValue(userState);
  const [state, dispatch] = useReducer(gigReducer, initialState);
  const [coverImage, setCoverImage] = useState(null);
  const [gigImages, setGigImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const mutation = useMutation({
    mutationFn: (gig) =>
      axiosFetch.post('/gigs', gig)
      .then(({data}) => {
        return data;
      })
      .catch(({response}) => {
        toast.error(response.data.message);
      })
    ,
    onSuccess: () => 
      queryClient.invalidateQueries(['my-gigs'])
  })

  const handleFormCange = (event) => {
    const { name, value } = event.target;
    dispatch({
      type: 'CHANGE_INPUT',
      payload: { name, value }
    })
  }

  const handleFormFeature = (event) => {
    event.preventDefault();
    dispatch({
      type: 'ADD_FEATURE',
      payload: event.target[0].value
    })
    event.target.reset();
  }

  const handleImageUploads = async () => {
    if (!coverImage || gigImages.length === 0) {
      toast.error('Zəhmət olmasa, yükləməmişdən əvvəl şəkilləri seçin!');
      return;
    }
  
    try {
      setUploading(true);
      const cover = await generateImageURL(coverImage);
      const images = await Promise.all(
        [...gigImages].map(img => generateImageURL(img))
      );
  
      console.log("Cover URL:", cover);
      console.log("Images URLs:", images);
  
      dispatch({
        type: 'ADD_IMAGES',
        payload: { cover, images } // URLs correctly passed now
      });
  
      toast.success('Şəkillər yükləndi!');
      setDisabled(true);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error('Yükləyərkən xəta baş verdi');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = { ...state, userID: user._id };
    console.log("Form data:", form);
  
    for (let key in form) {
      const value = form[key];
  
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0)
      ) {
        toast.error('Məcburi xanalari doldurun: ' + key);
        return;
      }
    }
  
    toast.success("Təbriklər! Siz xidmət bazarına daxil oldunuz!");
    mutation.mutate(form);
  
    setTimeout(() => {
      navigate('/my-gigs');
    }, 2000);
  };

  return (
    <div className='add'>
      <div className="container">
        <h1>Yeni xidmət əlavə et</h1>
        <div className="sections">
          <div className="left">
            <label htmlFor="">Ad</label>
            <input name='title' type="text" placeholder="e.g. Mən musiqi bəstələyə bilirəm" onChange={handleFormCange} />

            <label htmlFor="">Category</label>
            <select name="category" onChange={handleFormCange}>
              <option value=''>Kateqoriya</option>
              {
                cards.map((item) => (
                  <option key={item.id} value={item.slug}>{item.slug[0].toUpperCase() + item.slug.slice(1)}</option>
                ))
              }
            </select>

            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Örtük şəkli</label>
                <input type="file" accept='image/*' onChange={(event) => setCoverImage(event.target.files[0])} />
                <br />
                <label htmlFor="">Şəkilləri yüklə</label>
                <input type="file" accept='image/*' multiple onChange={(event) => setGigImages(event.target.files)} />
              </div>
              <button disabled={!!disabled} onClick={handleImageUploads}>{uploading ? 'yüklənir' : disabled ? 'Yükləndi' : 'yüklə'}</button>
            </div>

            <label htmlFor="">Məlumat</label>
            <textarea name='description' cols="30" rows="16" placeholder='Müştəriyə satacağın xidmət haqqında məlumat' onChange={handleFormCange}></textarea>
            <button onClick={handleFormSubmit}>Yarat</button>
          </div>

          <div className="right">
            <label htmlFor="">Xidmət adı</label>
            <input type="text" name='shortTitle' placeholder='e.g. Bir sehifelik veb dizayn' onChange={handleFormCange} />

            <label htmlFor="">Qısa məlumat</label>
            <textarea name='shortDesc' cols="30" rows="10" placeholder='Xidmətinin qısa təsviri' onChange={handleFormCange}></textarea>

            <label htmlFor="">Təhvil müddəti (e.g. 3 gün)</label>
            <input type="number" name='deliveryTime' min='1' onChange={handleFormCange} />

            <label htmlFor="">Reviziya nömrəsi</label>
            <input type="number" name='revisionNumber' min='1' onChange={handleFormCange} />

            <label htmlFor="">Funksionallıq əlavə et</label>
            <form className='add' onSubmit={handleFormFeature}>
              <input type="text" placeholder='e.g. səhifə dizaynı' onChange={handleFormCange} />
              <button type='submit'>Əlavə et</button>
            </form>
            <div className="addedFeatures">
              {
                state.features?.map((feature) => (
                  <div key={feature} className="item">
                    <button onClick={() => dispatch({ type: 'REMOVE_FEATURE', payload: feature })}>{feature}
                      <span>X</span>
                    </button>
                  </div>
                ))
              }
            </div>
            <label htmlFor="">Qiymət</label>
            <input name='price' type="number" min='1' onChange={handleFormCange} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Add