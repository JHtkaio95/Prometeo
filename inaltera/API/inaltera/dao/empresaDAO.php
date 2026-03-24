<?php
class empresaDAO {

    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function registrarEmpresa($NIF, $razon_social, $domicilio_fiscal, $codigo_postal, $localidad, $provincia, $pais, $telefono_empresarial, $id_usuario){
        $query = "INSERT INTO datos_empresas (NIF, razon_social, domicilio_fiscal, codigo_postal, localidad, provincia, pais, telefono_empresarial, id_usuario) 
            VALUE (:nif, :razon, :domicilio, :copo, :localidad, :provincia, :pais, :telefono, :usuario)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':nif', $NIF);
        $stmt->bindParam(':razon', $razon_social);
        $stmt->bindParam(':domicilio', $domicilio_fiscal);
        $stmt->bindParam(':copo', $codigo_postal);
        $stmt->bindParam(':localidad', $localidad);
        $stmt->bindParam(':provincia', $provincia);
        $stmt->bindParam(':pais', $pais);
        $stmt->bindParam(':telefono', $telefono_empresarial);
        $stmt->bindParam(':usuario', $id_usuario);

        return $stmt->execute();

    }

    

    public function actualizarEmpresa($NIF, $razon_social, $domicilio_fiscal, $codigo_postal, $localidad, $provincia, $pais, $telefono_empresarial, $id_usuario){
        $query = "UPDATE datos_empresas SET NIF = :nif, razon_social = :razon, domicilio_fiscal = :domicilio,
            codigo_postal = :copo,
            localidad = :localidad,
            provincia = :provincia,
            pais = :pais,
            telefono_empresarial = :telefono,
            id_usuario = :usuario WHERE NIF = :nif2";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':nif', $NIF);
        $stmt->bindParam(':razon', $razon_social);
        $stmt->bindParam(':domicilio', $domicilio_fiscal);
        $stmt->bindParam(':copo', $codigo_postal);
        $stmt->bindParam(':localidad', $localidad);
        $stmt->bindParam(':provincia', $provincia);
        $stmt->bindParam(':pais', $pais);
        $stmt->bindParam(':telefono', $telefono_empresarial);
        $stmt->bindParam(':usuario', $id_usuario);
        $stmt->bindParam(':nif2', $NIF);

        return $stmt->execute();
    }

    public function empresaExiste($NIF){
        $query = "SELECT * FROM datos_empresas WHERE NIF = :nif";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nif", $NIF);
        
        if($stmt->execute()->next()) {
            return true;
        }

        return false;
    }

    public function buscarPorUsuario($id){
        $query = "SELECT * FROM datos_empresas WHERE id_usuario = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }   

    public function buscarPorEmpresa($NIF){
        $query = "SELECT * FROM datos_empresas WHERE NIF = :nif";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":nif", $NIF);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}
?>