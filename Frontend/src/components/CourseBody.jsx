import React, { useEffect, useState } from "react";
import Cards from "../components/Cards";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CourseBody() {
  const [book, setBook] = useState([]);
  useEffect(() => {
    const getBook = async () => {
      try {
        const res = await axios.get("https://bookstore-gvbx.onrender.com/book");
        // console.log(res.data);
        setBook(res.data);
      } catch (error) {
        console.log("error in Axios", error);
      }
    };
    getBook();
  }, []);
  return (
    <div className="max-w-screen-2x1 container mx-auto md:px-20 px-4">
      <div className="pt-28 text-center items-center justify-center">
        <h1 className="text-2xl font-bold md:text-4xl">
          We're delighted to have you{" "}
          <span className="text-pink-500">here! :)</span>{" "}
        </h1>
        <p className="mt-12">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam,
          animi! Iusto praesentium laborum ad facere reprehenderit. Libero
          ducimus repellat nostrum rem nulla repellendus impedit incidunt, esse,
          perspiciatis minus sapiente quidem?
        </p>
        <Link to="/">
          <button className="mt-6 btn btn-secondary">back</button>
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4">
        {book.map((item) => (
          <Cards key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
