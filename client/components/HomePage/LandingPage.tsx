import { useEffect, useState } from 'react';
import img1 from '../../public/img/sickst-black.jpg';
import img2 from '../../public/img/sickst-pink.jpg';
import { ChevronLeft, ChevronRight, Image, ShoppingCart } from 'react-feather';
import HeaderLandingPage from '../HeaderLandingPage';
import Link from 'next/link';
import ImageNext from "next/image";

const LandingPage = () => {
    const [productList, setProductList] = useState([
        {
            id: '1',
            price: 80.00,
            img: img1,
            title: "Clive Christian",
            description: "Descopera serviciul de abonament pentru parfumuri, ce iti ofera acces la o colectie diversificata la acelasi pret ca in magazin. Bucura-te de sticlute portabile si elegante, perfecte pentru orice ocazie! Transforma fiecare zi într-o experienta unica, fara compromisuri de stil sau calitate."
        },
        {
            id: '2',
            price: 299.99,
            img: img2,
            title: "Queen Anne",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat at fugiat ratione eum, tempore quia rerum quis minus consequatur ab voluptas sunt sint ullam consequuntur rem voluptates, ea id sapiente."
        }
    ]);
    const [thumbnailList, setThumbnailList] = useState([
        {
            id: '1',
            img: img2,
            title: "Some title 2",
            description: "some long ass description"
        },
        {
            id: '2',
            img: img1,
            title: "Some title 3",
            description: "some long ass description"
        }
    ])
    const [next, setNext] = useState(0);
    const [prev, setPrev] = useState(0);
    const [activeClass, setActiveClass] = useState('');
    const [showThumbnailAnimation, setShowThumbnailAnimation] = useState(true);

    useEffect(() => {
        if(next !== 0) {
            setActiveClass('next');
            setShowThumbnailAnimation(false);
    
            const timeout = setTimeout(() => {
                setActiveClass('');
                setShowThumbnailAnimation(true);
            }, 500);
    
            return () => clearTimeout(timeout);
        }
    }, [next]);

    useEffect(() => {
        if(prev !== 0) {
            setActiveClass('prev');
    
            const timeout = setTimeout(() => {
                setActiveClass('');
            }, 500);
    
            return () => clearTimeout(timeout);
        }
    }, [prev]);

    const checkFirstItem = () => {
        // we consider the first product representing subscription
        const isSubscription = productList[0].id === '1';
        return isSubscription;
    }

    const handleNext = () => {
        const firstItem = productList[0];
        let newList = productList.slice(1);
        newList.push(firstItem);
        setProductList([...newList]);

        const firstThumb = thumbnailList[0];
        let restThumbItems = thumbnailList.slice(1);
        restThumbItems.push(firstThumb);
        setThumbnailList([...restThumbItems]);

        setNext(prevVal => prevVal + 1);
    }

    const handlePrev = () => {
        const lastItem = productList[productList.length - 1];
        const rest = productList.slice(0, -1);
        setProductList([lastItem, ...rest]);

        const lastThumb = thumbnailList[thumbnailList.length - 1];
        const restThumb = thumbnailList.slice(0, -1);
        setThumbnailList([lastThumb, ...restThumb]);

        setPrev(prevVal => prevVal + 1);
    }

    return (
    <>
        <HeaderLandingPage />
        <div className={`carousel ${activeClass}`}> 
            <div className="carousel--list">
                {productList.map(item => (
                    <div className="carousel--list--item" key={item.id} >
                        <img src={item.img.src} />
                        <div className="content">
                            <div className="title">{item.price} {checkFirstItem() ? 'lei/luna' : 'lei'}</div>
                            <div className="topic">{item.title}</div>
                            <div className="des">
                                {item.description}
                            </div>
                            <div className="lp-buttons">
                                <Link href={"/subscriptions"}>
                                    <a>
                                        <div className="cart">
                                            <ShoppingCart size={12} stroke={'#000'} strokeWidth={3} />
                                        </div>
                                        Aboneaza-te
                                    </a>    
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* thumbnail */}
            <div className={`thumbnail ${showThumbnailAnimation ? 'showThumbnail' : ''}`}>
                {thumbnailList.length > 0 &&
                    <div className="item" onClick={checkFirstItem() ? handleNext : handlePrev}>
                        <img className='wave-clip' src={thumbnailList[0].img.src} />
                        <div className="perfume-icon">
                            <img src='/perfume-bottle.svg' />
                        </div>
                        <div className="content">
                            <div className="logo">
                                <ImageNext src='/logo-black.svg' alt="Logo" width={45} height={50}  />
                            </div>
                            <svg width='100' height='100'>
                                <path id="circle" fill='#000' d='M 10 49 A 40 40 0 1 1 10 50'></path>
                                <text className='circle-text'>
                                    <textPath href='#circle'>- Original - fragrance</textPath>
                                </text>
                            </svg>
                        </div>
                    </div>
                }
            </div>
            {/* arrows */}
            <div className="arrows">
                {checkFirstItem() 
                    ? <button 
                        id='prev'
                        onClick={handleNext}
                    >
                        Incearca un <br></br>
                        parfum nou
                        <div className="arrow-wrapper">
                            <div className='arrow-body'></div>
                            <ChevronRight size={14} />
                        </div>
                    </button>
                    : <button 
                        id='next'
                        onClick={handlePrev}
                    >
                        Creaza-ti propria <br></br>
                        colectie de parfumuri
                        <div className="arrow-wrapper">
                            <ChevronLeft size={14} />
                            <div className='arrow-body'></div>
                        </div>
                    </button>
                }
            </div>
        </div>
    </>
)}

export default LandingPage;