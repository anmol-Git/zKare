import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from './zkare.png';
const Banner = () => {
  const bannerStyle = {
    backgroundColor: '#FFFFFF',
    padding: '10px',
    marginBottom: "20px",
    textAlign: 'left',
  };

  const titleStyle = {
    fontSize: '24px',
    marginBottom: '1px',
    marginLeft: '20px',
    marginTop: '10px',
    color: '#000000',
    fontFamily: "Sans-serif",
  };

  const descriptionStyle = {
    fontSize: '16px',
  };

  return (
    <div style={bannerStyle}>
      <Link href="/dashboard">
        <Image 
        src={logo}
        alt="picture"
        width ={125}
        height={50}
        ></Image>
        </Link>
    </div>
  );
};

export default Banner;
