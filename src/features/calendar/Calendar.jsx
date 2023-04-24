import React, { useEffect, useState } from "react";
import {format, startOfMonth, endOfMonth, addMonths, subMonths, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, differenceInCalendarDays} from "date-fns";
import { selectAllUsers } from "../users/usersApiSlice";
import { useSelector } from "react-redux";
import './Calendar.css';
import ScheduleActivityForm from "../scheduler/ScheduleActivityForm";

const Calendar = ({activities, showModal, setModalContent, handleClose}) => {
    const users = useSelector(selectAllUsers)

    const [date, setDate] = useState({
        currentMonth: new Date(),
        selectedDate: new Date()
    })

    const [agendaActivities, setAgendaActivities] = useState([]) 

    useEffect(() => {
        const formattedEvents = []
        activities.map(activity => {
            const { participants } = activity;
            for(let i = 0; i < participants.length; i++) {
                if(activity.start_date !== activity.end_date) {
                    let duration = differenceInCalendarDays(new Date(activity.end_date), new Date(activity.start_date))
    
                    for(let y = 0; y <= duration; y ++) {
                        const newActivity = { ...activity }
                        const id = crypto.randomUUID()
                        const { color, name } = users.find(user => user._id.toString() === participants[i].toString());
                        const day = addDays(new Date(newActivity.start_date), y)
                        newActivity.original_id = activity._id
                        newActivity.id = id;
                        newActivity.color = color;
                        newActivity.name = name;
                        newActivity.start_date = format(day, 'yyyy-MM-dd');
                        formattedEvents.push(newActivity)
                    }
    
                } else if (activity.start_date === activity.end_date){
                    formattedEvents.push(activity)
                }
            }
        })
        setAgendaActivities(formattedEvents)
    },[activities, users])

    const nextMonth = () => {
        let new_date = { ...date }
        new_date.currentMonth = addMonths(date.currentMonth, 1)
        setDate(new_date)
    };

    const prevMonth = () => {
        let new_date = { ...date }
        new_date.currentMonth = subMonths(date.currentMonth, 1)
        setDate(new_date)
    };

    function renderHeader() {
        const dateFormat = "MMMM yyyy";

        return (
            <div className="header row flex-middle">
                <div className="col col-start">
                    <div className="icon" onClick={prevMonth}>
                    chevron_left
                    </div>
                </div>
                <div className="col col-center">
                    <span>{format(date.currentMonth, dateFormat)}</span>
                </div>
                <div className="col col-end" onClick={nextMonth}>
                    <div className="icon">chevron_right</div>
                </div>
            </div>
        );
    }

    function renderDays() {
        const dateFormat = "EEEE";
        const days = [];

        let startDate = startOfWeek(date.currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
            <div className="col col-center" key={i}>
                {format(addDays(startDate, i), dateFormat)}
            </div>
            );
        }

        return <div className="days row">{days}</div>;
    }

    const showEventToolTip = (activity) => {
        const orig_activity = activities.find(item => item.id.toString() === activity.original_id.toString())
        setModalContent(<ScheduleActivityForm submitType='edit' handleClose={handleClose} activity={orig_activity} title='Edit Activity' buttonText="Edit Activity"/>)
        showModal()
    }

    function renderCells() {
        const { currentMonth, selectedDate } = date;
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = new Date(day);
                const id = format(cloneDay, 'yyyy-MM-dd')

                const relatedActivity = agendaActivities?.filter(activity => {
                    return activity.start_date === id
                })
                const events = []  

                if(relatedActivity?.length > 0) {
                    relatedActivity.map(rel_act => { // eslint-disable-line
                        //TODO: REPLACE THE END OF THE STRING WITH ... IF IT'S TO LONG
                        events.push(
                            <span 
                                key={rel_act.id}
                                className="agenda__event" 
                                style={{backgroundColor: rel_act.color, position: "relative"}}
                                onClick={() => showEventToolTip(rel_act)} 
                            >
                                {rel_act.title}
                            </span>
                        )
                    })
                }

                days.push(
                    <div 
                        id={id} 
                        className={`col cell ${!isSameMonth(day, monthStart) ? "disabled" : isSameDay(day, selectedDate) ? "selected" : ""}`}
                        key={day}
                    >  
                        {events}
                        <span className="number">{formattedDate}</span>
                    </div>
                
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="row" key={day}>
                {days}
                </div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>;
    }

    return (
      <div className="calendar">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    );
}

export default Calendar;