create database ADB_PROYECT;

use ADB_PROYECT;


-- Cuadro de texto, cuadro combinado, select, cuadro de control, llenar select dependiente de otro select



CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombres VARCHAR(150) COLLATE "C" NOT NULL,
    apellidos VARCHAR(150) COLLATE "C" NOT NULL,
    foto bytea null,
    perfil VARCHAR(20) COLLATE "C" NULL,
    usuario VARCHAR(100) COLLATE "C" UNIQUE NOT NULL,
    contraseña VARCHAR(200) COLLATE "C" NOT NULL,
    fecha_registro TIMESTAMP NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

INSERT INTO usuario (nombres, apellidos, foto, perfil, usuario, contraseña,   fecha_registro)
VALUES ('LUNA', 'ROSA', null, 'Administrador', 'willy', '$2a$12$p7nbpolyn/E1GV8EYzGgE.kssTEvozi7ncTLC3HAkQqBjxhqCbSRm', CURRENT_TIMESTAMP);
select * from usuario;


/* table miembro*/


CREATE TABLE miembro (
    id_miembro SERIAL PRIMARY KEY,
    nombres VARCHAR(150) COLLATE "C" NOT NULL,
    apellidos VARCHAR(150) COLLATE "C" NOT NULL,
	ci VARCHAR(150) COLLATE "C" NOT NULL,
	dirrecion VARCHAR(150) COLLATE "C" NOT NULL,
	telefono INTEGER NOT NULL,
	fecha_naci DATE NOT NULL,
    registro_fecha DATE NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

insert into miembro(nombres,apellidos,ci,dirrecion,telefono,fecha_naci,registro_fecha) values ('START','QUBYTESOFT','89696986','LA GUARDIA','67735546','1994-09-18','2022-01-13');
select * from miembro;


/* table ministerio*/


CREATE TABLE Ministerio (
    id_ministerio SERIAL PRIMARY KEY,
    nombre VARCHAR(150) COLLATE "C" NOT NULL,
    descripcion VARCHAR(150) COLLATE "C" NOT NULL,
    registro_fecha DATE NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

insert into ministerio(nombre,descripcion,registro_fecha) values ('START','QUBYTESOFT','2022-01-13');
select * from ministerio;



/* table de tipo ingresos */


CREATE TABLE tipo_ingresos (
    id_tipo_ingresos SERIAL PRIMARY KEY,
    nombre VARCHAR(150) COLLATE "C" NOT NULL,
    registro_fecha DATE NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);

INSERT INTO tipo_ingresos (nombre, registro_fecha)
VALUES ('Diezmos', '2022-01-13');

select * from tipo_ingresos;

/* table de  ingresos */


CREATE TABLE ingreso (
    id_ingreso SERIAL PRIMARY KEY,
    monto DECIMAL(10, 2) NULL, -- Cambiado a tipo DECIMAL
    fecha_ingreso TIMESTAMP NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
	
    id_usuario INTEGER REFERENCES usuario(id_usuario),
    id_tipo_ingresos INTEGER REFERENCES tipo_ingresos(id_tipo_ingresos),
    id_miembro INTEGER REFERENCES miembro(id_miembro)
); 
 
 INSERT INTO ingreso (monto, fecha_ingreso, estado, id_usuario, id_tipo_ingresos, id_miembro)
VALUES (5.99, CURRENT_TIMESTAMP, TRUE, 1, 6,4);


SELECT * FROM tipo_ingresos WHERE id_tipo_ingresos = 7;



SELECT i.*, u.nombres,t.nombre, m.nombres
        FROM ingreso i
				LEFT JOIN usuario u ON i.id_usuario = u.id_usuario
        LEFT JOIN tipo_ingresos t ON i.id_tipo_ingresos = t.id_tipo_ingresos 
        LEFT JOIN miembro m ON i.id_miembro = m.id_miembro

