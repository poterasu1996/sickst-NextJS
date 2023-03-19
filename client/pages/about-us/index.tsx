import React from "react";
import banner from "../../public/img/banner.jpg";
import Cards from "./cards";
import people from "../../public/img/peopla.jpg";
import { Column } from "primereact";
import { dividerClasses } from "@mui/material";
<link
  href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap"
  rel="stylesheet"
></link>;
export default function index() {
  const staff = [
    {
      name: "Gicu Pericol",
      position: "Founder",
      image: people.src,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
        ornare viverra imperdiet. Donec eget tortor hendrerit, pharetra mi
        nec, feugiat risus. Nam elementum hendrerit aliquet. Duis eget
        libero non ipsum convallis finibus id id libero. Donec elementum
        quam felis, a volutpat turpis sollicitudin at. Mauris congue erat
        non pharetra faucibus. Duis vitae augue et lacus fringilla`,
    },
    {
      name: "Gicu Pericol",
      position: "Founder",
      image: people.src,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
          ornare viverra imperdiet. Donec eget tortor hendrerit, pharetra mi
          nec, feugiat risus. Nam elementum hendrerit aliquet. Duis eget
          libero non ipsum convallis finibus id id libero. Donec elementum
          quam felis, a volutpat turpis sollicitudin at. Mauris congue erat
          non pharetra faucibus. Duis vitae augue et lacus fringilla`,
    },
  ];
  return (
    <div className="main-content">
      <div className="container aboutus-page">
        {/* Banner section */}
        <div className="aboutus-page--banner">
          <img src={banner.src}></img>
        </div>

        {/* About us description */}
        <div className="aboutus-page--summary">
          <h2 className="heading">About sickst</h2>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            ornare viverra imperdiet. Donec eget tortor hendrerit, pharetra mi
            nec, feugiat risus. Nam elementum hendrerit aliquet. Duis eget
            libero non ipsum convallis finibus id id libero. Donec elementum
            quam felis, a volutpat turpis sollicitudin at. Mauris congue erat
            non pharetra faucibus. Duis vitae augue et lacus fringilla
            dignissim.
          </p>
        </div>
        {/* Team */}
        <div className="aboutus-page--team">
          <h2 className="heading">Meet the team</h2>
          <h3 className="subheading">OUR FOUNDERS</h3>
          <div className="cards row">
            {staff.map((el) => (
              <Cards
                src={el.image}
                name={el.name}
                position={el.position}
                description={el.description}
              />
            ))}
          </div>
        </div>
        {/* Contact */}
        <div className="aboutus-page--contact">
          <h2 className="title">Contact Us</h2>
          <div className="row contact-us">
            <div className="col-12 col-sm-4">
              <h4 className="subheading">Want to meet us face to face?!</h4>
              <p className="description">
                1600 Perrineville Road Ste. 2 – 395, Monroe Twp., NJ 08831
              </p>
            </div>
            <div className="col-12 col-sm-4">
              <h4 className="subheading">Drop us a line</h4>
              <p className="description">ceva@example.com</p>
            </div>
            <div className="col-12 col-sm-4">
              <h4 className="subheading">Need help?</h4>
              <p className="description">
                <a href="www.google.com"> CLICK HERE &rarr;</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
