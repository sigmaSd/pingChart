import Chart from "chart.js/auto";
import ChartStreaming from 'chartjs-plugin-streaming';
import 'chartjs-adapter-date-fns';


const main = async function() {
  Chart.register(ChartStreaming);

  const myChart = new Chart(
    document.getElementById("main"),
    {
      type: "line",
      options: {
        scales: {
          x: {
            type: 'realtime',
          }
        }
      },
      data: {
        datasets: [
          {
            label: "ping",
          },
        ],
      },
    },
  );

  const socket = new WebSocket('ws://localhost:8000');
  socket.onmessage = (e) => {
    myChart.data.datasets[0].data.push({
      x: new Date(),
      y: parseFloat(e.data),
    });
    myChart.update('quiet');
  }
}

main()
