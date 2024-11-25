/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import logoSrc from '@/assets/logo_kupi.png';
import { getTransactionDetailCashierWS } from '@/slices/thunks';
import { useParams } from 'react-router-dom';

export const Voucher = () => {
  document.title = 'Voucher | Kupi';

  const { numTransaccion } = useParams();
  const [pdfData, setPdfData] = useState(null);
  const [dataReport, setDataReport] = useState(null);
  const user = useSelector(state => state.Login.user);

  useEffect(() => {
    if (user) _getInformation();
  }, [user]);

  useEffect(() => {
    if (dataReport) handleGeneratePdf();
  }, [dataReport]);

  const _getInformation = async () => {
    try {
      const { data } = await getTransactionDetailCashierWS(numTransaccion, user.token);
      setDataReport(data);
    } catch (error) {
      console.error('Error fetching information:', error);
      setDataReport(null);
    }
  };

  const handleGeneratePdf = async () => {
    const pdfBytes = await generateVoucherPDF();
    setPdfData(pdfBytes);
  };

  // Descargar el PDF utilizando file-saver
  const handleDownloadPdf = () => {
    if (pdfData) {
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      saveAs(blob, 'documento.pdf');
    }
  };

  const generateVoucherPDF = async () => {

    const { fecAprobacion, refTransaccion, valTransaccion } = dataReport;
    const { nomEmpresa } = user;

    const data = {
      title: 'COMPROBANTE TRANSACCIÓN',
      numero: numTransaccion,
      fecha: fecAprobacion.replace('T', ' '),
      empresa: nomEmpresa,
      referencia: refTransaccion,
      valor: valTransaccion,
    };

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Courier);
    const boldFont = await pdfDoc.embedFont(StandardFonts.CourierBold);
    const colorBlack = rgb(0, 0, 0);
    const page = pdfDoc.addPage([300, 500]);
    const { width, height } = page.getSize();
    let currentY = height - 40;

    const splitTextIntoLines = (text, font, fontSize, maxWidth) => {
      return text.split(' ').reduce((lines, word) => {
        const line = lines[lines.length - 1] ? `${lines[lines.length - 1]} ${word}` : word;
        const lineWidth = font.widthOfTextAtSize(line, fontSize);
        if (lineWidth < maxWidth) lines[lines.length - 1] = line;
        else lines.push(word);
        return lines;
      }, ['']);
    };

    const addText = ({ text, textTitle = '', fontSize = 12, isBold = false, alignment = 'left', padding = 100 }) => {
      const fontToUse = isBold ? boldFont : font;
      const lines = splitTextIntoLines(text, fontToUse, fontSize, width - padding);

      lines.forEach((line) => {
        const xPosition = alignment === 'center' 
          ? (width - fontToUse.widthOfTextAtSize(textTitle + line, fontSize)) / 2 
          : 48;

        if (textTitle) {
          page.drawText(textTitle, { x: xPosition, y: currentY, size: fontSize, font: boldFont, color: colorBlack });
        }
        page.drawText(line, { x: xPosition + font.widthOfTextAtSize(textTitle, fontSize), y: currentY, size: fontSize, font: fontToUse, color: colorBlack });
        currentY -= fontSize + 4;
      });
      currentY -= 6;
    };

    const logoBytes = await fetch(logoSrc).then(res => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoWidth = 50;
    const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
    
    page.drawImage(logoImage, {
      x: (width - logoWidth) / 2,
      y: height - logoHeight - 20,
      width: logoWidth,
      height: logoHeight,
      opacity: 0.2
    });

    currentY -= 60;
    const centerText = (text, isBold = false) => addText({ text, isBold, alignment: 'center' });

    centerText('KUPI', true);
    centerText(data.title, true);
    centerText(`No. ${data.numero}`, true);
    addText({ textTitle: 'Fecha: ', text: data.fecha, alignment: 'center' });
    addText({ textTitle: 'Nombre: ', text: data.empresa, alignment: 'center' });
    addText({ textTitle: 'Ref: ', text: data.referencia, alignment: 'center' });
    centerText('VALOR', true);
    centerText(`$${data.valor}`);
    centerText('**************************');
    centerText('Carrera 38a # 23 - 38');
    centerText('Tuluá, Valle del Cauca');
    centerText('www.kupi.com.co');
    centerText('**************************');

    // const pdfDoc = await PDFDocument.create();
    // const font = await pdfDoc.embedFont(StandardFonts.Courier);
    // const boldFont = await pdfDoc.embedFont(StandardFonts.CourierBold);

    // const colorBlack = rgb(0, 0, 0);

    // let page = pdfDoc.addPage([300, 500]);
    // const { width, height } = page.getSize();
    // let currentY = height - 40;

    // const splitTextIntoLines = (text, font, fontSize, maxWidth) => {
    //   const words = text.split(' ');
    //   const lines = [];
    //   let currentLine = '';

    //   words.forEach((word) => {
    //     const lineTest = currentLine ? `${currentLine} ${word}` : word;
    //     const lineWidth = font.widthOfTextAtSize(lineTest, fontSize);
    //     if (lineWidth < maxWidth) {
    //       currentLine = lineTest;
    //     } else {
    //       lines.push(currentLine);
    //       currentLine = word;
    //     }
    //   });

    //   if (currentLine) lines.push(currentLine);
    //   return lines;
    // };

    // const addText = ({text, textTitle = '', fontSize = 12, isBold = false, color = colorBlack, padding = 100, alignment = 'left'}) => {
    //   let lines = splitTextIntoLines(text, isBold ? boldFont : font, fontSize, width - padding);
    //   lines.forEach((line) => {
    //     if (currentY < 40) {
    //       page = pdfDoc.addPage([width, height]);
    //       currentY = height - 40;
    //     }
    //     const textWidth = font.widthOfTextAtSize(line, fontSize);
    //     let xPosition;
        
    //     switch (alignment) {
    //       case 'center': {
    //         if(textTitle !== '') {
    //           xPosition = (width - font.widthOfTextAtSize(line+textTitle, fontSize)) / 2;
    //         } else {
    //           xPosition = (width - textWidth) / 2;
    //         }
    //         break;
    //       }
    //       default:
    //         xPosition = 48;
    //     }
    //     let sizeTitle = 0;
    //     if(textTitle !== '') {
    //         page.drawText(textTitle, {
    //         x: xPosition,
    //         y: currentY,
    //         size: fontSize,
    //         font: boldFont,
    //         color: color,
    //       });
    //       sizeTitle = font.widthOfTextAtSize(textTitle, fontSize);
    //     }
    //     page.drawText(line, {
    //       x: xPosition + sizeTitle,
    //       y: currentY,
    //       size: fontSize,
    //       font: isBold ? boldFont : font,
    //       color: color,
    //     });
    //     currentY -= fontSize + 4;
    //   });
    //   currentY -= 6;
    // };

    // // Cargar la imagen del logo (puede ser una URL, un archivo base64, etc.)
    // const logoBytes = await fetch(logoSrc).then(res => res.arrayBuffer());
    // const logoImage = await pdfDoc.embedPng(logoBytes);
    // const logoWidth = 50;
    // const logoHeight = (logoImage.height / logoImage.width) * logoWidth;

    // // Dibujar la imagen del logo en la esquina superior izquierda
    // page.drawImage(logoImage, {
    //     x: (width - logoWidth) / 2,
    //     y: height - logoHeight - 20,
    //     width: logoWidth,
    //     height: logoHeight,
    //     opacity: 0.2
    // });

    // currentY -= 60;
    // addText({text: 'KUPI', isBold: true, alignment: 'center'});
    // addText({text: data.title, isBold: true, alignment: 'center', padding: 160});
    // addText({text: `No. ${data.numero}`, isBold: true, alignment: 'center'});
    // addText({textTitle: 'Fecha: ', text: data.fecha, alignment: 'center'});
    // addText({textTitle: 'Nombre: ', text: data.empresa, alignment: 'center'});
    // addText({textTitle: 'Ref: ', text: data.referencia, alignment: 'center'});
    // addText({text: '', alignment: 'center'});
    // addText({text: '', alignment: 'center'});
    // addText({text: '', alignment: 'center'});
    // addText({text: 'VALOR', isBold: true, alignment: 'center'});
    // addText({text: `$${data.valor}`, alignment: 'center'});
    // addText({text: '**************************', alignment: 'center'});
    // addText({text: 'Carrera 38a # 23 - 38', alignment: 'center'});
    // addText({text: 'Tuluá, Valle del Cauca', alignment: 'center'});
    // addText({text: 'www.kupi.com.co', alignment: 'center'});
    // addText({text: '**************************', alignment: 'center'});

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            icon="mdi-cellphone"
            title="Voucher"
            pageTitle=" Informes"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div>
                    <button className='btn btn-outline-primary' onClick={handleDownloadPdf} disabled={!pdfData}>Descargar PDF</button>
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
          </Row>
        </Container>
      </div>
    </>
  );
}