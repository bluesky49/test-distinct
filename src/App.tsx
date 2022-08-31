import React, { useRef, useState } from 'react';
import { Header, Footer, Table } from "./components";
import './App.css';
import { FaInfoCircle } from "react-icons/fa";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas"

interface invoiceProps {
  "Employee ID": string
  "Numbers of Hours": number | null
  "Unit Price": string
  "Cost": number | null
}

function App() {
  const ref = useRef<HTMLInputElement>(null);
  const [timesheetData, setTimeSheetData] = useState<any[]>([]);
  const [invoiceData, setInvoiceData] = useState<invoiceProps[]>([]);
  const [err, setErr] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setTimeSheetData(results.data as any[]);
        },
      })
    }
  }
  const getTimeDiff = (startTime: string, endTime: string): number => {
    const start = new Date(2022, 8, 31, +startTime.split(":")[0], +startTime.split(":")[1]).getTime();
    const end = new Date(2022, 8, 31, +endTime.split(":")[0], +endTime.split(":")[1]).getTime();
    return (end - start) / 3600000;
  }
  const generateInvoice = (e: React.MouseEvent) => {
    const supportedFields = ["Employee ID", "Billable Rate (per hour)", "Project", "Date", "Start Time", "End Time"];
    const proceedFields = supportedFields.map(s => s.replace(/ /g, "").toLowerCase());
    for (let i of Object.keys(timesheetData[0])) {
      if (!proceedFields.includes(i.replace(/ /g, "").toLowerCase())) {
        setErr(true)
      }
    }
    const headers = Object.keys(timesheetData[0]);
    const temp: invoiceProps[] = timesheetData.map(t => ({
      "Employee ID": t[headers[0]],
      "Numbers of Hours": getTimeDiff(t[headers[4]], t[headers[5]]),
      "Unit Price": "$",
      "Cost": getTimeDiff(t[headers[4]], t[headers[5]]) * t[headers[1]]
    }))
    const totalCost = temp.map(t => t["Cost"]).reduce((a, b) => a! + b!, 0);
    temp.push({ "Employee ID": "", "Numbers of Hours": null, "Unit Price": "Total", "Cost": totalCost })
    setInvoiceData(temp)
  }

  const printDocument = () => {
    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0, 0, 0);
        pdf.save("invoice.pdf");
      })
      ;
  }
  return (
    <div className='page'>
      <Header />
      <div className="body">
        <div className="content">
          <div className="description">
            <FaInfoCircle />
            <div style={{ marginLeft: 10 }}>
              <span>Please upload a timesheet. It need to have the following fields: </span>
              <div><strong>Employee ID, Billable Rate, Project, Date, Start Time, End Time</strong></div>
            </div>
          </div>
          <input type="file" ref={ref} hidden accept=".csv" onChange={handleChange} />
          <button className="upload-button" onClick={() => ref.current?.click()}>Upload timesheet</button>
          {timesheetData.length ? <div className='preview'>Preview TimeSheet</div> : null}
          <Table data={timesheetData} />
          {timesheetData.length ? <button className='upload-button generate-invoice' onClick={generateInvoice}>Generate Invoice</button> : null}
          {err ?
            <div>Some fields are wrong</div> :
            <>
              <Table data={invoiceData} type="invoice" />
              {invoiceData.length ? <button className='upload-button generate-invoice' onClick={printDocument}>Download Invoice</button> : null}
            </>
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
