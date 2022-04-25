import Link from "next/link";
import bimg1 from "../../public/img/subs-banner1.jpg";

const SubscriptionBanner = () => {
  return (
    <>
      <div className="subs-banner">
        <div
          className="subs-banner--wrapper"
          style={{
            backgroundImage: `url(${bimg1.src})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="subs-banner--content">
            <div className="title">You can have it all</div>
            <div className="description">
              Balancing perfumery with environmental responsibility, Skylar
              proves that you can have safe, clean scents that smell utterly
              alluring.
            </div>
            <Link href="/">
                <a className="button-second my-5">Get started</a>
            </Link>
            {/* <SecondaryLink btnname={"Get started"} to="/" /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionBanner;
