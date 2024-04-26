import React from "react";

export default function Cards({ item }) {
  return (
    <div className="mt-6 my-4 p-3">
      <div className="card w-92 shadow-xl hover:scale-105 duration-300 cursor-pointer bg-white text-black dark:bg-slate-950 dark:text-white dark:border">
        <figure>
          <img src={item.image} alt="Item Image" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {item.name}
            <div className="badge badge-secondary">{item.category}</div>
          </h2>
          <p>{item.title}</p>
          <div className="card-actions justify-between">
            <div className="badge badge-outline">${item.price}</div>
            <div className="cursor-pointer rounded-lg px-2 py-1 border-[2px] hover:bg-pink-500 hover:text-white duration-200">
              Buy Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
