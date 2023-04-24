import { useState, useEffect, useRef, Fragment } from "react"
import { selectAllUsers } from "../users/usersApiSlice";
import { useSelector } from "react-redux";
import CustomPieChart from "./Chart";
import { pluck, sumUp, sumUpConditional } from "../../helpers/helpers";
import { formatCurrency } from "../../helpers/formatting"; 

import './ProjectChart.css'

const ProjectChart = ({project, projectBreakdown, projectActivities, userNames}) => {
    
    const users = useSelector(selectAllUsers);
    const colors = ["#253340", "rgb(0, 177, 255)", "#FF8042", "#AF19FF"];

    let content

    console.log(projectBreakdown, project)    

    let totalHoursData = []
    let totalCostsData = []
    let totalKilometersData = []
    let totalTravelHoursData = []
    userNames.map(name => {
        const {name: fullname} = users.find(user => user._id === name)
        const totalHours = sumUpConditional(projectActivities, {id: name, category: 'Hours'})
        const totalCosts = sumUpConditional(projectActivities, {id: name, category: 'Costs'})
        const totalKM = sumUpConditional(projectActivities, {id: name, category: 'Kilometers'})
        const totalTravelHours = sumUpConditional(projectActivities, {id: name, category: 'Travel Hours'})
        totalHoursData.push({name: fullname, value: totalHours, id: name}) 
        totalCostsData.push({name: fullname, value: totalCosts, id: name})
        totalKilometersData.push({name: fullname, value: totalKM, id: name})
        totalTravelHoursData.push({name: fullname, value: totalTravelHours, id: name})
    })
    let totalCost = totalCostsData.reduce((prev, curr) => {return prev + curr.value},0)
    let totalKM  = totalKilometersData.reduce((prev, curr) => {return prev + curr.value},0)
    let totalHours  = totalHoursData.reduce((prev, curr) => {return prev + curr.value},0)
    let totalTravelHours = totalTravelHoursData.reduce((prev, curr) => {return prev + curr.value},0)
    
    const showTooltip = (id) => {
        const tooltip = document.getElementById(id).classList.toggle('open')
    }

    content =  (
        <Fragment>
            <div className="project__charts">
                <div className="chart__container">
                    <h3>Total Hours Breakdown</h3>
                    <div className="chart__body">
                        <CustomPieChart colors={colors} data={totalHoursData} />
                    </div>
                </div>
                <div className="chart__container">
                    <h3>Total Costs Breakdwon</h3>
                    <div className="chart__body">
                        <CustomPieChart colors={colors} data={totalCostsData} />
                    </div>
                </div>
                {totalKM > 0 && (
                    <div className="chart__container">
                        <h3>Total Kilometers Breakdown</h3>
                        <div className="chart__body">
                            <CustomPieChart colors={colors} data={totalKilometersData} />
                        </div>
                    </div>
                )}
                {totalTravelHours > 0 && (
                    <div className="chart__container">
                        <h3>Total Travel Hours Breakdown</h3>
                        <div className="chart__body">
                            <CustomPieChart colors={colors} data={totalTravelHoursData} />
                        </div>
                    </div>
                )}
            </div>
            <div className="project__breakdown">
                {projectBreakdown.map((user) => {
                    // const cost = sumUp(totalCostsData, user)
                    // const hours = sumUp(totalHoursData, user)
                    // const {name: fullname} = users.find(us => us._id === user)
                    // const kmFee = (sumUp(totalKilometersData, user) * 0.19)
                    // const projectValue = project.value;
                    // let projectSplit = ((projectValue - totalCost - (totalKM * 0.19)))
                    // if(totalHours > 0) {
                    //     projectSplit = (projectSplit / totalHours) * hours
                    // }
                    
                    return (
                        <div key={user.fullname} className="participant">
                            <table>
                                <tbody>
                                    <tr>
                                        <th style={{fontWeight: 'bold'}} >Name:</th>
                                        <th style={{fontWeight: 'bold'}} >{user.fullname}</th>
                                    </tr>
                                    <tr>
                                        <th>Costs:</th>
                                        <th className="with_symbol">
                                            <div className="symbol">€</div>
                                            <div className="value">{formatCurrency(user.totalCosts)}</div>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>Kilometer fee (€0,19):</th>
                                        <th className="with_symbol">
                                            <div className="symbol">€</div>
                                            <div className="value">{formatCurrency(user.kmFee)}</div>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>Project Split:</th>
                                        <th className="with_symbol">
                                            <div className="symbol">€</div>
                                            <div className="value">{formatCurrency(user.projectsplit)}</div>
                                        </th>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>Total:</td>
                                        <td className="with_symbol">
                                            <div className="icon">€</div>
                                            <div className="value" style={{position: 'relative'}}>{formatCurrency(user.totalSplit)}
                                                <i className="fa-solid fa-circle-info" onClick={() => showTooltip(`tooltip-total-${user}`)} style={{position: 'absolute', right: '-20px', bottom: '4px', cursor: 'pointer'}}></i>
                                                <span className="helper" id={`tooltip-total-${user}`}>Calculation = (Total Project Value - costs - kilometer fee) * % hours </span>
                                            </div>
                                            
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )
                })}
                
            </div>
        </Fragment>
    )

    return content
}

export default ProjectChart