import "./tableshared.css"
const TableShared = ({tableHeader,tableBody}) =>{

    return(
        <div className="table-container">
            <table>
            <thead>
                <tr>
                {
                    tableHeader.map((td)=>{
                        return(
                            <th>
                                {td}
                            </th>
                        )
                    })
                }
                </tr>
            </thead>
            <tbody>
                {
                    tableBody.map((job)=>{
                        return(
                            <tr>
                                {
                                    Object.values(job).map((item)=>{
                                        return(
                                            <td key={Math.random()}>
                                                {item}
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        </div>
    )
}
export default TableShared;