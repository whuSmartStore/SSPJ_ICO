### users

```postgresql

CREATE TABLE public.users
(
    email varchar(50) primary key,
    password varchar(250),
    firstName varchar(50),
    lastName varchar(50),
    address varchar(50),
    invested numeric(20, 4) default 0,
    bonus numeric(20, 4) default 0,
    sspj numeric(20, 4) default 0,
    ethAddress varchar(50),
    ethAddressModifiable boolean default true,
    token varchar(250),
    auth boolean default false,
    createAt bigint
)
WITH (
  OIDS = FALSE
);
ALTER TABLE public.users
  OWNER TO sspj_ico;

```



### followers

```postgresql

CREATE TABLE public.followers
(
    id serial primary key,
    token varchar(250),
    email varchar(50)
) 
WITH (
  OIDS = FALSE
);
ALTER TABLE public.followers
  OWNER TO sspj_ico;

```



### bills

```postgresql

CREATE TABLE public.bills
(
    id serial primary key,
    email varchar(50),
    paid numeric(20, 4),
    payType varchar(50) default 'ETH',
    type varchar(50) default 'Token Bought',
    sspj numeric(20, 4),
    TXHash varchar(200),
    createAt bigint,
    block bigint
) 
WITH (
  OIDS = FALSE
);
ALTER TABLE public.bills
  OWNER TO sspj_ico;

```



### questions

```postgresql

CREATE TABLE public.questions
(
    id serial primary key,
    name varchar(50),
    link varchar(200),
    count int,
    stable boolean
) 
WITH (
  OIDS = FALSE
);
ALTER TABLE public.questions
  OWNER TO sspj_ico;

```



### sspj

```postgresql

CREATE TABLE public.sspj
(
    id serial primary key,
    type varchar(50),
    amount numeric(20, 4),
    rate numeric(20, 2),
    remain numeric(20, 4)
)
WITH (
  OIDS = FALSE
);
ALTER TABLE public.sspj
  OWNER TO sspj_ico;

```