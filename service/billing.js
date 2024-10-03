
import calculateBill from '../utlis/calculateBill.js'; // Use relative path



export const calcBillSerice = ({minutes, dataUsage, smsCount, plan}) => {

    return calculateBill(minutes, dataUsage, smsCount, plan)

}