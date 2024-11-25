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

import { useParams } from 'react-router-dom';
import { getInvoicesComercioWS } from '../../../slices/reports/thunk';
import { formatSaldoCOP } from '../../../utilities';

export const VoucherFactCom = () => {
  document.title = 'Voucher comercio | Kupi';

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
      const dataRequest = {
        params: numTransaccion,
        token: user.token,
        bodyOptions: []
      }
      const { data } = await getInvoicesComercioWS(dataRequest);
      console.log("El data es--->", data.body);
      setDataReport(data);
    } catch (error) {
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

    const { fecFactura, numFactura, valLiquidacion, fecInicial,fecFinal, valFactura, valPagado, valPagos } = dataReport.body;
    const { nomEmpresa } = user;
    console.log(fecFactura)
    const data = {
      title: 'LIQUIDACION CORTE',
      numero: numFactura.toString(),
      fecha: fecFactura.replace('T', ' '),
      empresa: nomEmpresa,
      referencia: numFactura.toString(),
      corte: fecInicial.toString() + " / " + fecFinal.toString(),
      valor: formatSaldoCOP(valLiquidacion),
      pagosProcesados: formatSaldoCOP(valPagado)
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
    centerText(`No. P-${data.numero}`, true);
    addText({ textTitle: 'Fecha: ', text: data.fecha, alignment: 'start' });
    addText({ textTitle: 'Nombre: ', text: data.empresa, alignment: 'start' });
    addText({ textTitle: 'Ref: ', text: data.referencia, alignment: 'start' });
    addText({ textTitle: 'Corte: ', text: data.corte, alignment: 'start' });

    centerText('VALOR', true);
    centerText(`${data.valor}`);
    centerText('**************************');
    centerText('Carrera 38a # 23 - 38');
    centerText('Tuluá, Valle del Cauca');
    centerText('www.kupi.com.co');
    centerText('**************************');

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