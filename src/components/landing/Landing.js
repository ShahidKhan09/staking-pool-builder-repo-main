import '../../App.scss';
import { API_URL } from '../../utils/ApiURL';
import Footer from './footer/Footer';
import Navbar from './header/Navbar';
import Banner from './main-banner/Banner';
import Loader from '../../hooks/loader'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
const Landing=()=> {
  const { account } = useWeb3React()
  const [colorData, setColorData] = useState(undefined);
  const [load, setLoad] = useState(false)
  const poolColors = async () => {
    try {
      setLoad(true)
      const res = await axios.get(`${API_URL}project/getAllProjectDetails`)
      console.log('Res of the color api===>', res?.data?.data[0])
      setColorData(res?.data?.data[0])
      setLoad(false)
    } catch (error) {
      setLoad(false)
      console.log('error of api===>', error)
    }
  }
  useEffect(() => {
    poolColors()
  }, [])
  return (
    <>
    {/* {load && <Loader text="Loading..." />} */}
    <div style={{ backgroundColor: `${colorData?.bodyColor}` }}>
      <Navbar colorData={colorData} />
      <Banner colorData={colorData} />
      <Footer colorData={colorData} />
    </div>
    </>
  );
}

export default Landing;