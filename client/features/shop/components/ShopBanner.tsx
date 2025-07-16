import { useEffect, useState } from "react";

// Components
import RotatingText from "../../../components/global/RotatingText/RotatingText";

// Services
import brandService from "../../../services/brandService";
import HttpService from "../../../services/HttpService";

const ShopBanner = () => {
    const [brands, setBrands] = useState<string[]>(['']);

    useEffect(() => {
        const fetchData = async () => {
            const brandResp = await brandService.getAllBrands();
            if (HttpService.isErrorResponse(brandResp)) {
              console.error("Failed to load brands.", brandResp.error);
            } else {
              const _parsedBrands = brandResp.data.map(b => b.attributes.brand_name);
              setBrands(_parsedBrands);
            }
        }

        fetchData();
    }, [])

    return (<>
        <div className="shop-banner">
            <div className="shop-banner--description">
                <div className="rotating-text">
                    <RotatingText 
                        texts={brands}
                        mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2000}
                    />
                </div>
                <div className="text flex justify-center gap-4">
                    Why stop at 1, when
                </div>
                <div className="text flex justify-center gap-4">
                    you can have them all!
                </div>
            </div>
        </div>
    </>)
} 

export default ShopBanner;