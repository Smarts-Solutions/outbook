import React , {useState} from "react";

const CustomerTable = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ marginBottom: "10px" }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    cursor: "pointer",
                    backgroundColor: "#f0f0f0",
                    padding: "10px",
                    borderRadius: "5px",
                }}
            >
                <strong>First Accordion</strong> {isOpen ? "-" : "+"}
            </div>
            {isOpen && (
                <div style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
                    <strong>Details:</strong> {data.details}
                </div>
            )}
        </div>
    );
};

export default CustomerTable;

