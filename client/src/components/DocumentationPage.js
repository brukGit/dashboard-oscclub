import React, { useState } from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import modelView from '../assets/images/model_view.jpg';

const DocContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px);
`;

const Sidebar = styled.div`
  width: 200px;
  background-color: #f0e6e1;
  padding: 1rem;
`;

const ViewerSection = styled.div`
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const SectionButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: ${props => props.active ? '#C7672D' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  text-align: left;
  cursor: pointer;
`;

const DataModel = styled.img`
  height: 400px;
  width: auto;
`;

const CodeBlock = styled(SyntaxHighlighter)`
  font-family: 'Fira Code', monospace;
`;

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('codebase');

  const sections = {
    codebase: {
      title: 'Codebase',
      content: (
        <>
          <h2>Python Code Sample | Fetching data for External debt stocks</h2>
          <CodeBlock language="python" style={vscDarkPlus}>
            {`import pandas as pd
import wbgapi as wb
# switch to DSI(Debt Statistic Indicator) (source 6), default is 2
wb.db = 6
# check if source is correct
wb.series.info()
# Access External debt stocks, long-term (DOD, current US$)  | DT.DOD.DLXF.CD
indicator_code = "DT.DOD.DLXF.CD"
countries = ['ETH', 'UZB', 'ARG', 'DZA','VNM','TZA']
time_range = range(2010, 2021)  # years 2010 to 2020

print("\\n" + "-"*25 +"Fetching External Debt Statistics Long Term" + "-"*25 + "\\n")
try:
    EXD = wb.data.DataFrame(indicator_code, countries,time=time_range, skipBlanks=False, columns='series').reset_index()
    EXD.rename(columns={indicator_code: "ExternalDebtStock"}, inplace=True)
    print(EXD.head())
except Exception as e:
    print(f"An error occurred: {e}")

print("\\n" + "-"*50 + "\\n")

# Export dataframe for use in PowerBI
EXD.to_csv("externalDebtLongTerm.csv")`}
          </CodeBlock>
        </>
      )
    },
    dashboard: {
      title: 'Data Model',
      content: (
        <>
          <h2>Data Model</h2>
          <DataModel src={modelView} alt="Model view" />
        </>
      )
    },
    resources: {
      title: 'Resources',
      content: (
        <>
          <h2>Project Resources</h2>
          <ul>
            <li><a href="https://github.com/brukGit/assessmentResourcesOSC" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
          </ul>
        </>
      )
    }
  };

  return (
    <DocContainer>
      <Sidebar>
        {Object.entries(sections).map(([key, { title }]) => (
          <SectionButton
            key={key}
            active={activeSection === key}
            onClick={() => setActiveSection(key)}
          >
            {title}
          </SectionButton>
        ))}
      </Sidebar>
      <ViewerSection>
        {sections[activeSection].content}
      </ViewerSection>
    </DocContainer>
  );
};

export default DocumentationPage;
