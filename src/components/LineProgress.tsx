import React, { useState } from 'react'
import { motion, easeInOut } from 'framer-motion'

interface ILineProgress {
    title?: string;
    percentage: number;
    color?: string
}

/**@param 
 * color tailwind
 * percentage : number
 * @description
 * Simple animated progress line
 */
const LineProgress: React.FC<ILineProgress> = (props) => {

   // const [percent, setPercent] = useState<number>(props.percentage);

    // control the color based on percentage value
    function colorControl (value: number) {
        if (props.percentage < 50) {
            return '#FA4A4A'
        } else if (props.percentage >= 50 && props.percentage < 79) {
            return '#ED801A';
        } else {
            return '#62DB4F';
        }
    }

    return (
        <>
            {props.title && <div className={`font-bold`}>{props.title}</div>}
            <motion.div
                initial={{
                    opacity: 0,
                }}

                animate={{
                    opacity: 1
                }}
                className={`w-full bg-slate-200 rounded-lg h-4 m-1`}>
                
                <motion.div
                     initial={{
                        opacity: 0,
                        width: 0,
                        backgroundColor: colorControl(0)
                    }}
    
                    animate={{
                        opacity: 1,
                        width: props.percentage + "%",
                        backgroundColor: [colorControl(props.percentage)]
                    }}

                    transition={{
                        duration: 1,
                        ease: easeInOut,
                        delay: .70
                    }}
                    className={`${props.color ? props.color : "bg-green-500"}  h-4 rounded-lg`}>
                </motion.div>
            </motion.div>
        </>
    )
}

export default LineProgress;