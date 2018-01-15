### users

```postgresql

CREATE TABLE public.users
(
    email varchar(50) primary key,
    password varchar(250),
    firstName varchar(50),
    lastName varchar(50),
    address varchar(50),
    invested bigint default 0,
    bonus bigint default 0,
    sspj bigint default 0,
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
    paid bigint,
    payType varchar(50) default 'ETH',
    type varchar(50) default 'Token Bought',
    sspj bigint,
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



### wallet

```postgresql

CREATE TABLE public.wallets
(
    id serial primary key,
    wtype varchar(50) default 'ETH',
    address varchar(50)
) 
WITH (
  OIDS = FALSE
);
ALTER TABLE public.wallets
  OWNER TO sspj_ico;

```



### wtypes

```postgresql

CREATE TABLE public.wtypes
(
    id serial primary key,
    type varchar(50)
) 
WITH (
  OIDS = FALSE
);
ALTER TABLE public.wtypes
  OWNER TO sspj_ico;

```



### sspj

```postgresql

CREATE TABLE public.sspj
(
    id serial primary key,
    type varchar(50),
    amount bigint,
    usage varchar(50)
) 
WITH (
  OIDS = FALSE
);
ALTER TABLE public.sspj
  OWNER TO sspj_ico;

```