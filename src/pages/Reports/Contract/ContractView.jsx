/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Card, CardBody, CardHeader } from 'reactstrap';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

import logoSrc from '@/assets/logo_kupi.png';
import firma from '@/assets/firma.png';
import { title, tableContract, contractSections } from './content';
import { findUserByIdtWS } from '@/slices/users/thunk';
import { getCompanieWS, postAccepstContract, findContractWS } from '@/slices/companies/thunk';
import { NumerosALetras } from 'numero-a-letras';
import Swal from 'sweetalert2';

import { defaultUser } from '@/utilities';

export const _ContractView = () => {
  const [pdfData, setPdfData] = useState(null);
  const [fetchUser, setFetchUser] = useState(defaultUser);
  const [fetchCompany, setFetchCompany] = useState();
  const [fetchContract, setFetchContract] = useState(null);
  const [ip, setIp] = useState('');
  const user = useSelector((state) => state.Login.user);

  useEffect(() => {
    if (user) fetchInformation();
  }, [user]);

  useEffect(() => {
    if (fetchUser && ip && fetchCompany) generatePdf();
  }, [fetchUser, ip, fetchCompany]);

  const fetchInformation = async () => {
    try {
      await Promise.all([findUserByID(), fetchUserIp(), fetchCompanyData(), fetchContractData()]);
    } catch (error) {
      console.error('Error fetching information:', error);
    }
  };

  const fetchUserIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setIp(data.ip);
    } catch (error) {
      console.error('Error fetching IP:', error);
    }
  };

  const findUserByID = async () => {
    try {
      const { data } = await findUserByIdtWS(user.token, user.codUsuario);
      setFetchUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const { data } = await getCompanieWS(user.codEmpresa);
      setFetchCompany(data);
    } catch (error) {
      console.error('Error fetching company:', error);
    }
  };

  const fetchContractData = async () => {
    try {
      const { data } = await findContractWS(user.token);
      console.log(data);
      setFetchContract(data);
    } catch (error) {
      console.log('-------------- Sin contrato');
      console.error('Error fetching contract:', error);
    }
  };

  const acceptContract = async () => {
    try {
      await postAccepstContract(user.token, ip, fetchCompany.desPospago);
      await Swal.fire({
        title: 'Registro exitoso',
        text: 'El contrato ha sido registrado con éxito',
        icon: 'success',
        confirmButtonText: 'Continuar',
        timer: 3000,
      });
      fetchInformation();
    } catch (error) {
      await Swal.fire({
        title: 'Error en el proceso',
        text: 'Ha ocurrido un error al realizar el registro del contrato\n' + error,
        icon: 'error',
        confirmButtonText: 'Continuar',
        timer: 3000,
      });
      console.error('Error fetching acceptContract:', error);
    }
  };

  const generatePdf = async () => {
    const pdfBytes = await createContractPdf();
    setPdfData(pdfBytes);
  };

  const downloadPdf = () => {
    if (pdfData) {
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      saveAs(blob, 'documento.pdf');
    }
  };

  const createContractPdf = async () => {
    const dataTableHeader = tableContract(user.nomEmpresa, fetchCompany.nitEmpresa, fetchContract ? `${fetchContract.numContrato}` : '' );
    const pdfDoc = await PDFDocument.create();
    const fonts = { normal: await pdfDoc.embedFont(StandardFonts.Helvetica), bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold) };

    const colors = { black: rgb(0, 0, 0), lightGrey: rgb(0.8, 0.8, 0.8), magenta: rgb(0.9, 0, 0.9) };
    let page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();
    let currentY = height - 40;

    const splitTextIntoLines = (text, font, fontSize, maxWidth) => {
      return text.split(' ').reduce((lines, word) => {
        const lineTest = lines[lines.length - 1] + ' ' + word;
        if (font.widthOfTextAtSize(lineTest.trim(), fontSize) < maxWidth) {
          lines[lines.length - 1] = lineTest;
        } else {
          lines.push(word);
        }
        return lines;
      }, ['']);
    };
    
    const addText = ({ text, fontSize = 12, isBold = false, color = colors.black, padding = 100, alignment = 'left' }) => {
      splitTextIntoLines(text, isBold ? fonts.bold : fonts.normal, fontSize, width - padding).forEach((line) => {
        if (currentY < 40) {
          page = pdfDoc.addPage([width, height]);
          currentY = height - 40;
        }
        const textWidth = fonts.normal.widthOfTextAtSize(line, fontSize);
        const xPosition = alignment === 'center' ? (width - textWidth) / 2 : 48;

        page.drawText(line, { x: xPosition, y: currentY, size: fontSize, font: isBold ? fonts.bold : fonts.normal, color });
        currentY -= fontSize + 4;
      });
      currentY -= 6;
    };

    const drawImage = async (imageSrc, x, y, targetWidth, opacity = 1) => {
      const imageBytes = await fetch(imageSrc).then(res => res.arrayBuffer());
      const image = await pdfDoc.embedPng(imageBytes);
      const heightRatio = (image.height / image.width) * targetWidth;
      page.drawImage(image, { x, y, width: targetWidth, height: heightRatio, opacity: opacity });
    };

    const drawTable = () => {
      const tableX = 50;
      const cellHeight = 20;
      const cellWidth = (width - tableX * 2) / 2;

      dataTableHeader.forEach((row, index) => {
        const y = currentY - index * cellHeight;
        page.drawLine({ start: { x: tableX, y }, end: { x: tableX + cellWidth * 2, y }, thickness: 1, color: colors.lightGrey });
        [0, 1, 2].forEach(col => page.drawLine({ start: { x: tableX + col * cellWidth, y }, end: { x: tableX + col * cellWidth, y: y - cellHeight }, thickness: 1, color: colors.lightGrey }));

        page.drawText(row.label, { x: tableX + 5, y: y - 15, size: 10, font: row.blond ?  fonts.bold :  fonts.normal, color: index === 0 ? colors.magenta : colors.black });
        page.drawText(row.value, { x: tableX + cellWidth + 5, y: y - 15, size: 10, font: row.blond ?  fonts.bold :  fonts.normal, color: index === 0 ? colors.magenta : colors.black });
      });
      page.drawLine({
        start: { x: tableX, y: currentY - dataTableHeader.length * cellHeight },
        end: { x: tableX + cellWidth * 2, y: currentY - dataTableHeader.length * cellHeight },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      currentY -= (dataTableHeader.length + 2) * cellHeight;
    };

    const finalParagraph = () => {
      let textWidth = 48;
      let currentDate = new Date();
      const drawText = (content, fontType, offset = 4) => {
        page.drawText(content, {
          x: textWidth,
          y: currentY,
          size: 12,
          font: fontType,
          color: colors.black,
        });
        textWidth += fonts.normal.widthOfTextAtSize(content, 12) + offset;
      };

      const splitText = (text) => {
        const width = 14;
        if (text.length <= width) return [text, ""]; // No hace falta dividir

        const words = text.split(" ");
        let part1 = "";
        let part2 = "";

        for (let word of words) {
          if ((part1 + " " + word).trim().length <= width) {
            part1 = (part1 + " " + word).trim();
          } else {
            part2 = text.slice(part1.length).trim();
            break;
          }
        }

        return [part1, part2];
      }
      
      drawText('Para constancia firman a los', fonts.normal);
      drawText(`${currentDate.getDate()} (${NumerosALetras(currentDate.getDate()).replace(' Pesos 00/100 M.N.', '').toLowerCase()})`,  fonts.bold, 10);
      drawText('días del mes de ', fonts.normal, 0);
      drawText(currentDate.toLocaleDateString("es-ES", { month: "long" }),  fonts.bold, 10);
      drawText('del año ', fonts.normal, 0);
      
      const year = currentDate.getFullYear();
      const yearLetters = splitText(`(${NumerosALetras(year).replace(' Pesos 00/100 M.N.', '')})`);
      drawText(`${year} ${yearLetters[0]}`,  fonts.bold);

      if (yearLetters[1]) {
        currentY -= 16;
        textWidth = 48;
        drawText(yearLetters[1],  fonts.bold, 10);
      }
      
      drawText('en dos originales de igual contenido.', fonts.normal);
    }

    const drawSignatureSection = async () => {
      const data_user = [`Nombre: ${user.nomUsuario} ${user.apeUsuario}`, `CC: ${fetchUser.numDocumento}`, `Fecha de Aprobación: ${formattedDate}`, `IP del Usuario: ${currentIp}`];
      currentY -= 120;
      page.drawText('EL CLIENTE:', { x: 48, y: currentY, size: 12, font:  fonts.bold, color: colors.black });
      page.drawText('KUPI GROUP S.A.S:', { x: width / 2, y: currentY, size: 12, font:  fonts.bold, color: colors.black });
      currentY -= 32;

      data_user.forEach(line => {
        page.drawText(line, { x: 48, y: currentY, size: 12, font:  fonts.bold, color: colors.black });
        currentY -= 16;
      });

      await drawImage(firma, (width / 2) + 20, currentY - 16, 120);
      const data_final = [
        { left: '__________________________________', right: '__________________________________' },
        { left: `${fetchUser.nomUsuario} ${fetchUser.apeUsuario}`, right: 'ALVARO GOMEZ SANCLEMENTE' },
        { left: `CC: ${fetchUser.numDocumento}`, right: 'CC: 94365201' },
        { left: `Empresa: ${user.nomEmpresa}`, right: 'Dirección: Carrera 27 No. 29 - 76 Tuluá' },
        { left: `Nit: ${fetchCompany.nitEmpresa}`, right: 'Email: contacto@kupi.com.co' },
        { left: `Dirección: ${fetchCompany.dirEmpresa}`, right: '' },
        { left: `Email: ${fetchUser.emaUsuario}`, right: '' },
      ];

      data_final.forEach(line => {
        page.drawText(line.left, { x: 48, y: currentY, size: 12, font: fonts.normal, color: colors.black });
        page.drawText(line.right, { x: width / 2, y: currentY, size: 12, font: fonts.normal, color: colors.black });
        currentY -= 16;
      });

    };

    // Main function calls
    await drawImage(logoSrc, 20, height - 60, 50, 0.2);
    addText({ text: title, isBold: true, color: colors.magenta, padding: 260, alignment: 'center' });
    addText({ text: 'Versión 8_JDR_agosto_2022', fontSize: 10 });
    drawTable();

    const sections = contractSections();
    sections.forEach((section) => {
      addText({text: section.title, isBold: true});
      section.pagraphs.forEach((pagraph) => {
        addText({text: pagraph});
      });
      currentY -= 10;
    });

    finalParagraph();
    const formattedDate = !fetchContract || !fetchContract.fecAceptacion
      ? new Date().toLocaleDateString('es-ES')
      : new Date(fetchContract.fecAceptacion).toLocaleDateString('es-ES');

    const currentIp = !fetchContract || !fetchContract.ipAceptacion
      ? ip
      : fetchContract.ipAceptacion

    await drawSignatureSection();

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};

  return (
    <>
      <Col lg={12}>
          <Card>
            <CardHeader>
              <h4>Contrato de Prestación de servicios</h4>
            </CardHeader>
            <CardBody>
              <div>
                <button className='btn btn-outline-primary' onClick={downloadPdf} disabled={!pdfData}>Descargar PDF</button>
                {!fetchContract && <button className='btn btn-outline-primary' style={{marginInline: 20}} disabled={!pdfData}>Rechazar Términos</button>}
                {!fetchContract && <button className='btn btn-outline-primary' onClick={acceptContract} disabled={!pdfData}>Aceptar Términos</button>}
                <div style={{ marginTop: '20px' }}>
                  {pdfData && (
                    <div style={{ height: '600px', overflow: 'auto', border: '1px solid #ccc' }}>
                      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
                        <Viewer
                          fileUrl={URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }))}
                          defaultScale={1.0}
                        />
                      </Worker>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
      </Col>
    </>
  );
}