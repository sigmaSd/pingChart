import Chart from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import { de } from 'date-fns/locale';

import ChartStreaming from 'chartjs-plugin-streaming';





const main = async function() {
  Chart.register(ChartStreaming);

  // const socket = new WebSocket('ws://localhost:8000');
  // console.log("opened socket")
  // socket.onmessage = (e) => {
  //   console.log(e)
  // }


  // your event listener code - assuming the event object has the timestamp and value properties

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
