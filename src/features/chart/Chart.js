import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const CustomPieChart = ({data, colors}) => {

    return (
        <PieChart width={250} height={350}>
            <Pie 
                dataKey='value'
                data={data}
                cx="50%" cy="50%"
                innerRadius={40} 
                outerRadius={80} 
                tooltip
                label
            >
                {data.map((entry, index) => (
                <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    position="inside"
                />
                ))}
            </Pie>
            <Legend verticalAlign="bottom" height={100}/>
            <Tooltip />
        </PieChart>
    )
}

export default CustomPieChart