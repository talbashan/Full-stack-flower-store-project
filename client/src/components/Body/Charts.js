import { PieChart, BarChart } from '@ui5/webcomponents-react-charts';
import httpCommon from '../../http-common';
import React, { useEffect, useState } from "react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


function Pie() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setpackages] = useState([]);
  const city = "Jerusalem"
  const calculate = (days) => {
    var relevant = new Array()
    var today = new Date()
    packages.forEach(package1 => {
      var counted = false
      if (new Date(package1.date).valueOf() < today.valueOf() + 100 && new Date(package1.date) > new Date(today.getFullYear(), today.getMonth(), today.getDate() - days)) {
        relevant.forEach(cell => {
          if (cell != undefined && cell.city == package1.city)//&&package1.happened==true)
          { cell.delivered++; counted = true }
        });
        if (!counted)//&&package1.happened==true)
          relevant.push({ city: package1.city, delivered: 1 })
      }
    })
    console.log(relevant)
    return relevant;
  }

  useEffect(() => {
    httpCommon.get('/packages')
      .then(
        (result) => {
          setIsLoaded(true);
          setpackages(result.data.packages);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div id="abo" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div class="panel" style={{ paddingTop: '25px', paddingBottom: '30px' }}>
          <div class="container">
            <div class="row">
              <div class="col-md-4 mt-3" >
                <h2>Today</h2>
                <PieChart
                  dataset={calculate(1)}
                  dimension={{ accessor: 'city' }}
                  measure={{
                    accessor: 'delivered',
                    colors: ['#cc33ff', '#600080', '#c299ff']
                  }} onClick={function noRefCheck() { }}
                  onDataPointClick={function noRefCheck() { }}
                  onLegendClick={function noRefCheck() { }} />
              </div>
              <div class="col-md-4 mt-3" >
                <h2>This Week</h2>
                <PieChart
                  dataset={calculate(7)}
                  dimension={{ accessor: 'city' }}
                  measure={{
                    accessor: 'delivered',
                    colors: ['#cc33ff', '#600080', '#c299ff']
                  }}
                  onClick={function noRefCheck() { }}
                  onDataPointClick={function noRefCheck() { }}
                  onLegendClick={function noRefCheck() { }} />
              </div>
              <div class="col-md-4 mt-3" >
                <h2>This Month</h2>
                <PieChart
                  dataset={calculate(30)}
                  dimension={{ accessor: 'city' }}
                  measure={{
                    accessor: 'delivered',
                    colors: ['#cc33ff', '#600080', '#c299ff']
                  }}
                  onClick={function noRefCheck() { }}
                  onDataPointClick={function noRefCheck() { }}
                  onLegendClick={function noRefCheck() { }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const formatD = (date => {
  return date.toISOString().split('T')[0].replace(/-0/g, '-')
})

function Bar() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [packages, setpackages] = useState([]);
  const [city, setCity] = useState("Jerusalem");

  const calculate = (cycle, repetition) => {
    var ds = cycle.ds, ms = cycle.ms;
    var relevant = new Array(repetition)
    var today = new Date()
    var to_day = formatD(today)
    var todarr = to_day.split('-')
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    for (let i = 0; i < repetition; i++) {
      var startd = new Date(todarr[0], todarr[1] - 1 - i * ms, todarr[2] - i * ds)
      var endd = new Date(todarr[0], todarr[1] - 1 - (i + 1) * ms, todarr[2] - (i + 1) * ds)
      relevant[i] = {
        name: (ms == 1 ? "month " + (-i.toString()) ://monthNames[today.getMonth()-i]:
          (ds == 7 ? ("week " + (-i.toString())) :
            (ds == 1 ? (startd.toDateString().split(' 00:00')[0]) :
              (formatD(startd) + " to " + formatD(endd))))),
        startd: startd,
        endd: endd,
        ordered: 0,
        delivered: 0
      }
    }
    console.log(relevant[0].name)
    var today = new Date()
    relevant.forEach(cell => {
      packages.forEach(package1 => {
        //make sure not to add
        if (package1.city == city && new Date(package1.date).valueOf() < cell.startd.valueOf() + 100 && new Date(package1.date).valueOf() > cell.endd.valueOf()) {
          cell.ordered++;
          if (package1.happened == true) { cell.delivered++; }
        }
      });

    })
    console.log(relevant)
    return relevant;
  }
  useEffect(() => {
    httpCommon.get('/packages')
      .then(
        (result) => {
          setIsLoaded(true);
          setpackages(result.data.packages);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div id="abo" >
        <div class="container">
          <div class="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                stats for: {city}
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <MenuItem style={{ padding: "5px" }} href="#" onClick={() => { setCity("Jerusalem") }}> Jerusalem</MenuItem>
                <MenuItem style={{ padding: "5px" }} href="#" onClick={() => { setCity("Haifa") }}> Haifa</MenuItem>
                <MenuItem style={{ padding: "5px" }} href="#" onClick={() => { setCity("Be'er Sheva") }}> Be'er Sheva</MenuItem>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <h2>Daily</h2>
              <BarChart
                dataset={calculate({ ds: 1, ms: 0 }, 7)}
                dimensions={[
                  {
                    accessor: 'name'
                  }
                ]}
                measures={[
                  {
                    accessor: 'ordered',
                    color: '#cc33ff'
                  },
                  {
                    accessor: 'delivered',
                    color: '#600080'
                  },

                ]}
                onClick={function noRefCheck() { }}
                onDataPointClick={function noRefCheck() { }}
                onLegendClick={function noRefCheck() { }}
                style={{
                  height: '60vh'
                }}
              />
            </div>
            <div class="col-md-4">
              <h2>Weekly</h2>
              <BarChart
                dataset={calculate({ ds: 7, ms: 0 }, 4)}
                dimensions={[
                  {
                    accessor: 'name'
                  }
                ]}
                measures={[
                  {
                    accessor: 'ordered',
                    color: '#cc33ff'
                  },
                  {
                    accessor: 'delivered',
                    color: '#600080'
                  },

                ]}
                onClick={function noRefCheck() { }}
                onDataPointClick={function noRefCheck() { }}
                onLegendClick={function noRefCheck() { }}
                style={{
                  height: '60vh'
                }}
              />
            </div>
            <div class="col-md-4">
              <h2>Monthly</h2>
              <BarChart
                dataset={
                  calculate({ ds: 0, ms: 1 }, 3)
                }
                dimensions={[
                  {
                    accessor: 'name'
                  }
                ]}
                measures={[
                  {
                    accessor: 'ordered',
                    color: '#cc33ff'
                  },
                  {
                    accessor: 'delivered',
                    color: '#600080'
                  },

                ]}
                onClick={function noRefCheck() { }}
                onDataPointClick={function noRefCheck() { }}
                onLegendClick={function noRefCheck() { }}
                style={{
                  height: '60vh'
                }}
              />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { Pie, Bar };








