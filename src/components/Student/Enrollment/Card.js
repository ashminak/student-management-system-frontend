
import React from 'react'


const Card = (props) => {
    const courseImages=[
       "/clinicalpschycology.png",
       "/dsa.png",
       "/se.png",
       "/cyber.png",
       "/AI.png",
       "/computernetwork.png",
       "/webdev.png",
    ]
  return (
    <div className='flex flex-col w-[350px] h-[460px]  overflow-hidden gap-1 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.2)] p-2 m-2'>
        <div>
            <img src={courseImages[props.index]} alt={props.courseName} className='w-full h-full object-contain rounded-t-lg'/>
        </div>
        <div className="flex flex-col flex-1">
        <div className='flex flex-col'>
            <div className="text-xl font-semibold text-slate-900">{props.courseName}</div>
            <div className="text-sm font-medium text-slate-500">{props.courseCode}</div>
        </div>
        <p className="text-sm text-slate-600 leading-6">{props.description}</p>
      <div className="mt-auto">

    <div className="flex justify-between">
        <div>{props.credits} Credits</div>
        <div>{props.duration} Months</div>
        <div>{props.courseType}</div>
    </div>

    <button  onClick={() => props.onClick({
    id: props.id
})} className="w-full mt-3 h-[45px] border border-[#51021E] rounded-lg text-[#51021E] font-bold hover:bg-[#51021E] hover:text-white transition">
        Request Enrollment
    </button>

        </div>
    </div>

    </div>
  )
}

export default Card