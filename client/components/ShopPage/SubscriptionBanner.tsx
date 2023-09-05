import Link from "next/link";
// @ts-ignore
import Slider from "react-slick";
import bimg1 from "../../public/img/subs-banner1.jpg";

const SubscriptionBanner = () => {
  const slickSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  return (
    <>
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
