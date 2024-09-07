import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

interface Data {

    id: number;
    product_id: number;
    price: number;
    updated_on: string;
}

interface ChartProps {
    data: Data[];
    product: string;
}

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
)


function LineChart({ data, product }: ChartProps) {

    const formattedDate = data.map(item => new Date(item.updated_on).toLocaleDateString());

    const chartTitle = product.toUpperCase();


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: ("Price History for: " + chartTitle),
                font:{
                    size: 24
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    maxRotation: 90,
                    minRotation: 90,
                }
            }
        }
    };


    const chartData = {

        labels: formattedDate,
        datasets: [
            {
                label: chartTitle,
                data: data.map(pricePoint => (pricePoint.price)),
                borderColor: "rgb(253, 149, 0)",
                backgroundColor: "rgb(253, 149, 0)"
            }
        ]
    }


    return (
        <>
            <div className='w-3/4 md:w-[600px] lg:w-[1100px] h-[400px]'>
                <Line options={options} data={chartData} />
            </div>
        </>
    )
}

export default LineChart;