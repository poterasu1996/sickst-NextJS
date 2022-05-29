import Link from "next/link";
import Slider from "react-slick";
import bimg1 from "../../public/img/subs-banner1.jpg";
import Head from "next/head";

const SubscriptionBanner = () => {
  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  return (
    <>
      <Head>
        <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head>
      <div className="subs-banner">
        <Slider {...slickSettings}>
          <div className="slide">
            <div className="image-wrapper">
              <img src={bimg1.src}></img>
            </div>
            <div className="content">
              <div className="title">You can have it all</div>
              <div className="description">
                Balancing perfumery with environmental responsibility, Skylar
                proves that you can have safe, clean scents that smell utterly
                alluring.
              </div>
              <Link href="/">
                  <a className="button-second my-5">Get started</a>
              </Link>
            </div>
          </div>

          <div className="slide flex-row-reverse">
            <div className="image-wrapper">
              <img src={bimg1.src}></img>
            </div>
            <div className="content">
              <div className="title">You can have it all</div>
              <div className="description">
                Balancing perfumery with environmental responsibility, Skylar
                proves that you can have safe, clean scents that smell utterly
                alluring.
              </div>
              <Link href="/">
                  <a className="button-second my-5">Get started</a>
              </Link>
            </div>
          </div>

          <div className="slide">
            <div className="image-wrapper">
              <img src={bimg1.src}></img>
            </div>
            <div className="content">
              <div className="title">You can have it all</div>
              <div className="description">
                Balancing perfumery with environmental responsibility, Skylar
                proves that you can have safe, clean scents that smell utterly
                alluring.
              </div>
              <Link href="/">
                  <a className="button-second my-5">Get started</a>
              </Link>
            </div>
          </div>

        </Slider>
      </div>
    </>
  );
};

export default SubscriptionBanner;
