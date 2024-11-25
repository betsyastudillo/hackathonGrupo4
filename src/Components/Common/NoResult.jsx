import KUPIICONS from "../../common/icons/icons";

const NoResult = ({ height="60", width="60", tittle="¡Lo sentimos! No se encontraron resultados", message="No hemos encontrado usuarios que coincidan con tu búsqueda." }) => {

  return (
    <div className="noresult">
      <div className="text-center">
        <KUPIICONS.Warning height={height} width={width} />
        <h5 className="mt-3"> {tittle} </h5>
        <p className="text-muted mb-0"> {message} </p>
      </div>
    </div>
  );
}

export default NoResult;