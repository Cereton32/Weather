import React from 'react';
import { useWeather } from '../context/Weather_Context';
import styled from 'styled-components';

const PastAndpredictedContainerContainer = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const TableHeader = styled.th`
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

function PastAndpredictedContainer() {
  const { weatherData } = useWeather();

  // Add a conditional check to handle null weatherData
  if (!weatherData || !weatherData.past14Days) {
    return <p>No weather data available</p>;
  }

  return (
    <PastAndpredictedContainerContainer>
      <h1>Past 14 Days Weather Data</h1>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Temperature Max (°C)</TableHeader>
            <TableHeader>Temperature Min (°C)</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {weatherData.past14Days.map((data, index) => {
            const date = new Date(data.date);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }).format(date);

            return (
              <TableRow key={index}>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{data.temperature_max} °C</TableCell>
                <TableCell>{data.temperature_min} °C</TableCell>
              </TableRow>
            );
          })}
        </tbody>
      </Table>
    </PastAndpredictedContainerContainer>
  );
}

export default PastAndpredictedContainer;
