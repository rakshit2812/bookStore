import React from "react";
import check from "../../public/checked.png"

export default function Confirmation() {
  return (
    <div>
      <dialog id="my_modal_3_confirmation" className="modal ">
        <div className="modal-box bg-white  dark:bg-slate-900">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex ">
            <img src={check} alt="tick" width="30px" />
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="#5cb85c" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> */}
            <h3 className="font-bold text-xl mx-2 confirm text-green-500">Sucess!</h3>
          </div>
          <p className="py-4">Your message has been sent. We will get back to you soon!</p>
        </div>
      </dialog>
    </div>
  );
}
