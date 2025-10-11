import React from "react";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cards from "./Cards";
import axios from "axios";

export default function FreebookCards() {
  const [book, setBook] = useState([]);
  useEffect(() => {
    const getBook = async () => {
      try {
        const res = await axios.get("https://bookstore-gvbx.onrender.com/book", {withCredentials : true});
        // console.log(res.data);
        const data = res.data.filter((data) => data.category === "Free");
        // console.log(data);
        setBook(data);
      } catch (error) {
        console.log("Error occured in getting book", error);
      }
    };
    getBook();
  }, []);

  // const filterData = list.filter((data) => data.category === "Free");
  // console.log(filterData);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="max-w-screen-2x1 container mx-auto md:px-20 px-4">
        <div>
          <h1 className="font-semibold pb-2 text-xl">Free Offered Courses</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo,
            temporibus minima quae reprehenderit, animi voluptates, perferendis
            molestias voluptatem distinctio deserunt alias praesentium eligendi
            quod pariatur corrupti dolore culpa dicta earum!
          </p>
        </div>

        <div>
          <Slider {...settings}>
            {book.map((data) => (
              <Cards item={data} key={data.id} />
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
}
