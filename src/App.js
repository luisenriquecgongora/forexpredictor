import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { CSVReader } from 'react-papaparse'
import { formatDate } from './helpers';
import ReactTags from 'react-tag-autocomplete'
import './App.css';
import modelSVM from './media/svm.png';
import modelRF from './media/forest.png';
import modelNB from './media/deep.png';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const models = [
  'SVM',
  'Random Forest',
  'Naive Bayes',
]

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const options = {
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: function (value) {
        return formatDate(value);;
      }
    }
  }
};


const initialTags = [
  { id: "Europe", name: "Europe" },
  { id: "US", name: "US" },
];

const initialSuggestions = [
  { id: 'European Economy', name: 'European Economy' },
  { id: 'Coronavirus', name: 'Coronavirus' },
  { id: 'Infection', name: 'Infection' },
  { id: 'American Economy', name: 'American Economy' },
  { id: 'European Union', name: 'European Union' },
  { id: 'America', name: 'America' },
  { id: 'Trumph', name: 'Trumph' },
  { id: 'Biden', name: 'Biden' },
  { id: 'Brexit', name: 'Brexit' },
];

const App = () => {
  const [data, setData] = useState([]);
  const [currentData, setCurrentdata] = useState([]);
  const [nAnalysisDays, setAnalysisDays] = useState(50);
  const [nPredictiveDays, setNPredictiveDays] = useState(10);
  const [tags, setTags] = useState(initialTags);
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [selectedModel, setSelectedModel] = useState(0);
  const reactTagsRef = React.createRef();

  function parseDate(str) {
    const y = str.substr(0, 4),
      m = str.substr(5, 2),
      d = str.substr(8, 2);
    return new Date(y, m-1, d);
  }


  const handleOnFileLoad = (data) => {
    const formattedData = data.map((row) => {
      if (!row.data[0]) return null;
      return [parseDate(row.data[0]).getTime(), row.data.slice(2, -1).map(n => parseFloat(n))];
    }).filter(x => !!x);
    setData(formattedData);
    setCurrentdata(formattedData);
  };

  const handleChange = (e) => {
    setAnalysisDays(e.target.value)
  }

  const handleChangePredictiveDays = (e) => {
    setNPredictiveDays(e.target.value)
  }

  const handleDelete = (i) => {
    const newTags = [...tags]
    setTags(newTags.filter((tag, index) => index !== i));
  }

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  }

  const handleSelectModel = (i)=>{
    setSelectedModel(i);
  }

  const handlePredict = ()=>{
    const newData = [...currentData];
    const newElement = [Date.now(), data.slice(-2,-1)[0][1]];
    console.log(newElement);
    newData.push(newElement);
    console.log(newData);
    setCurrentdata(newData);
  };

  useEffect(() => {
    const newData = data.slice(data.length - nAnalysisDays);
    setCurrentdata(newData);
  }, [nAnalysisDays, data]);
  

  return (
    <div className="app-container">
      <div className="left-container">
        <h1 className="title">Historical Data</h1>
        <div className="container-input-file">
          <CSVReader
            onDrop={handleOnFileLoad}
            noDrag
            addRemoveButton
          >
            <span>Click to upload historical data</span>
          </CSVReader>
        </div>
        <div className="container-inputs">
          <label>Number of Analysis Days</label>
          <input className="input-number" onChange={handleChange} type='number' value={nAnalysisDays} />
          <label>Number of Predictive Days</label>
          <input className="input-number" onChange={handleChangePredictiveDays} type='number' value={nPredictiveDays} />
        </div>
        <h1 className="title">News Data</h1>
        <ReactTags
          ref={reactTagsRef}
          tags={tags}
          suggestions={suggestions}
          onDelete={handleDelete}
          onAddition={handleAddition} />
        <div className="container-inputs">
          <label>Number of News</label>
          <input className="input-number" type='number' />
          <label>Number of Main Words per New</label>
          <input className="input-number" type='number' />
        </div>
        <h1 className="title">Prediction Model</h1>
        <h2>{models[selectedModel]}</h2>
        <img class="model-image" src={modelSVM} title="Support Vector Machine" onClick={()=>handleSelectModel(0)}/>
        <img class="model-image" src={modelRF} title="Random Forest" onClick={()=>handleSelectModel(1)}/>
        <img class="model-image" src={modelNB} title="Naive Bayes" onClick={()=>handleSelectModel(2)}/>
        <button className="action-button" onClick={handlePredict}>Predict</button>
      </div>
      <div className="chart-container">
        <Chart
          options={options}
          series={[{ data: currentData }]}
          type="candlestick"
        />

      </div>
    </div>

  );
}

export default App;
