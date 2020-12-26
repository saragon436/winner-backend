create database winnertrading;
use winnertrading;

CREATE TABLE `winnertrading`.`product_stock` (
  `idProduct_stock` INT NOT NULL AUTO_INCREMENT,
  `familia` VARCHAR(150) NULL,
  `categoria` VARCHAR(150) NULL,
  `idProduct` VARCHAR(10) NULL,
  `description` VARCHAR(150) NULL,
  `quantity` FLOAT NULL,
  PRIMARY KEY (`idProduct_stock`));

delimiter 
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_STOCK_BY_FILTERS`(_idProduct varchar(10),_description varchar(150))
BEGIN

	DECLARE QUERYWHERE VARCHAR(200);
    
	IF _idProduct IS NOT NULL THEN
		SET QUERYWHERE = CONCAT("idProduct LIKE '%",_idProduct,"%'");
    END IF;
    
    IF _description IS NOT NULL THEN
		IF QUERYWHERE IS NULL THEN
			SET QUERYWHERE = CONCAT("description LIKE '%",_description,"%'");
        ELSE
			SET QUERYWHERE = CONCAT(QUERYWHERE," AND description LIKE '%",_description,"%'");
        END IF;
    END IF;
    
    IF QUERYWHERE IS NULL THEN
		SET @QUERY = "SELECT * FROM product_stock"; 
	ELSE
		SET @QUERY = CONCAT("SELECT * FROM product_stock WHERE ",QUERYWHERE);
    END IF;
	PREPARE st FROM @QUERY;
	EXECUTE st;
END


delimiter 
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_STOCK_BY_FILTERS_ADVANCE`(_familia varchar(150),_categoria varchar(150),_idProduct varchar(10),_description varchar(150))
BEGIN

	DECLARE QUERYWHERE VARCHAR(200);
    
	IF _idProduct IS NOT NULL THEN
		SET QUERYWHERE = CONCAT("idProduct LIKE '%",_idProduct,"%'");
    END IF;
    
    IF _description IS NOT NULL THEN
		IF QUERYWHERE IS NULL THEN
			SET QUERYWHERE = CONCAT("description LIKE '%",_description,"%'");
        ELSE
			SET QUERYWHERE = CONCAT(QUERYWHERE," AND description LIKE '%",_description,"%'");
        END IF;
    END IF;
    
    IF QUERYWHERE IS NULL THEN
		SET @QUERY = "SELECT * FROM product_stock"; 
	ELSE
		SET @QUERY = CONCAT("SELECT * FROM product_stock WHERE ",QUERYWHERE);
    END IF;
	PREPARE st FROM @QUERY;
	EXECUTE st;
END

select distinct familia from product_stock order by 1 asc

select distinct categoria from product_stock where familia='CHICCO'

select * from product_stock where familia='CHICCO' and categoria='BIBERON'

delimiter 
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_FAMILY_ALL`()
BEGIN
select distinct familia from product_stock
order by 1 asc;
END

delimiter 
CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_CATEGORY_FAMILY`(_family varchar(100))
BEGIN
select distinct categoria from product_stock where familia=_family
order by 1 asc;
END