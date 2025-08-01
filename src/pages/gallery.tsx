import NeonSlider from '@/components/NeonSlider';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import styles from "@/app/assets/styles/MainPage.module.css";
import Footer from '@/components/Footer';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import PixelPreview from '@/components/PixelPreview';


const images = [
    '/nft1.webp',
    '/nft2.webp',
    '/nft3.webp',
    '/nft2.webp',
    '/nft3.webp',
    '/nft1.webp',
    '/nft3.webp',
    // '/nft2.png',
    // '/nft1.png',
];


const GalleryScreen = () => {

  type NFT = {
    id: string;
    createdBy?: string;
    songName?: string;
    colorMap?: any[];
    notesPlayed?: any[];
    img?: string;
    // add other properties as needed
  };

  const [nfts, setNFTs] = React.useState<NFT[]>([]);
  const [userNFTS, setUserNFTS] = React.useState<NFT[]>([]);
  const { user } = useAuth();



  useEffect(() => {
    const fetchNFTs = async () => {
      const querySnapshot = await getDocs(collection(db, "signatures"));
      const nfts = querySnapshot.docs.map((doc) => ({ ...(doc.data() as NFT), id: doc.id })) as NFT[];
      setNFTs(nfts);
      if (user) {
        setUserNFTS(nfts.filter(item => item.createdBy === user.uid));
      }
    };
    fetchNFTs();
  }, []);

  return (
    <>
      <div className="gallery-screen">
        <div className={styles.bannerContainer} style={{ textAlign: "center", margin: "0 auto" }}>
          <br />
          <br />
          <h2><p className="glitch">My Collection</p></h2>
        </div>
        
        <NeonSlider
          slides={userNFTS.map(nft => ({
            id: nft.id,
            img: nft.img || '/nft1.webp', // fallback image if not present
            songName: nft.songName || '',
            colorMap: nft.colorMap || [],
            notesPlayed: (nft.notesPlayed || []).join(','),
          }))}
        />

        <br />

        <div className={styles.bannerContainer} style={{ textAlign: "center", margin: "0 auto" }}>
          <h2><p className="glitch">Blockbeats <span data-text="NFTS" className="glitch">Marketplace</span></p></h2>
          <br />
        </div>
        <div className="gallery-grid">
          {nfts.map((src, index) => (
            <div className="gallery-item" key={index}>
              <h3>{src.songName} {index + 1}</h3>
              <br />
              {/* <p>Description for image {index + 1}</p>                 */}
              <div className="gallery-item-overlay">
                  <PixelPreview
                    colorMap={src.colorMap || []}
                    notesCount={src.notesPlayed ? src.notesPlayed.length : 0}
                    size={100}
                  />
                  {/* <img src={src} alt={`Gallery ${index}`} className="gallery-image" /> */}
                  {/* <button className={styles.submitBtn} style={{ animation: 'none', background: 'transparent' }}>View</button> */}
                  <button className={styles.submitBtn} style={{ animation: 'none' }}>Buy</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />
      <Footer />
    </>
  );
};

export default GalleryScreen;
