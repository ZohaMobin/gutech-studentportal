import React from 'react';
import './PrintButton.css';

const PrintButton = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button 
      onClick={handlePrint}
      style={{
        padding: '8px 16px',
        backgroundColor: '#991D20',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        margin: '20px 0',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
      className="print-button"
    >
      Print Transcript
    </button>
  );
};

export default PrintButton;