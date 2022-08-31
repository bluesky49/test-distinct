import React from "react";
import "./style.css";

interface Props {
  data: any[]
  type?: string
}
const Table: React.FC<Props> = (props) => {
  const { data, type } = props;
  if (!data.length) return null;
  return (
    <div className="table-container" id={type === "invoice" ? "divToPrint" : ""}>
      {type === "invoice" ? <div className="company-name">Company: <div></div></div> : null}
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map(h => (
              <th key={h} className={type === "invoice" ? "custom-header" : ""}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <tr key={index} className={type === "invoice" && index === data.length - 1 ? "last-row" : ""}>
              {Object.values(d).map((i: any, index) => (
                <td key={index} className={type === "invoice" ? "custom-cell" : ""}>{i}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default Table;
