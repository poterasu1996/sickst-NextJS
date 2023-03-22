import React from "react";

type Props = {
  src?: string;
  name: string;
  position: string;
  description: string;
};

function Cards({ src, name, position, description }: Props) {
  return (
    <div className="card-team col-12 col-md-6">
      <img className="card-team--image" src={src} />
      <h2 className="card-team--name">{name}</h2>
      <h4 className="card-team--position">{position}</h4>
      <p className="card-team--description">{description}</p>
    </div>
  );
}

export default Cards;
