INSERT INTO dev3."Actions" ("name",active) VALUES
	 ('Approve',true),
	 ('Read',true),
	 ('Write',true),
	 ('Publish',true);
	
INSERT INTO dev3."DeviceComponents" ("name","deviceId") VALUES
	 ('webLeft',1),
	 ('webRight',2),
	 ('mobFinance',3);
	
INSERT INTO dev3."Groups" ("name","codeName",color,active,super,"createdById","createdAt","updatedById","updatedAt","deletedById","deletedAt") VALUES
	 ('Administração','Admin','#FFB300',true,true,NULL,NULL,NULL,NULL,NULL,NULL);
	
INSERT INTO dev3."Users" (super,login,"password","confirmationCode",active,"needChange","systemUser","groupId","createdById","createdAt","updatedById","updateAt","deletedById","deletedAt") VALUES
	 (true,'admin','$2b$10$azTsDzONct/TabirPYZSSuvWbstowVCKNzgaiH18tSo5lRhhdoshW','92611',true,false,true,1,NULL,NULL,NULL,NULL,NULL,NULL);
	
INSERT INTO dev3."Functions" ("name","codeName",active,"path",icon,visible,"deviceComponentsId","createdById","createdAt","updatedById","updateAt","deletedById","deletedAt") VALUES
	 ('Ações','acao',true,'/actions','settings_accessibility',true,1,1,'2024-02-01 00:00:00',NULL,NULL,NULL,NULL),
	 ('Funções','funcao',true,'/functions','pending_actions',true,1,1,'2024-02-01 00:00:00',NULL,NULL,NULL,NULL),
	 ('Grupos de segurança','security',true,'/securityGroup','group_work',true,1,1,'2024-02-01 00:00:00',NULL,NULL,NULL,NULL),
	 ('Clientes','customer',true,'/customer','person_pin_circle',true,1,1,'2024-02-01 00:00:00',NULL,NULL,NULL,NULL),
	 ('Planos','plans',true,'/plans','assignment',true,1,1,'2024-02-01 00:00:00',NULL,NULL,NULL,NULL),
	 ('Personalização de regras','personalrules',true,'/clientRules','assignment_ind',true,1,1,'2024-02-01 00:00:00',NULL,NULL,NULL,NULL),
	 ('Perfíl','userProfile',true,'/userProfile','assignment_ind',true,2,1,'2024-02-01 00:00:00',NULL,NULL,NULL,NULL),
	 ('Chaves de Acesso','subscriptionkey',true,'/subscriptionkey','vpn_key',true,1,1,'2024-02-01 00:00:00',NULL,NULL,NULL,NULL);


INSERT INTO dev3."Profile" ("userId","name",email,cellphone,phone,cpf,photo,"addressesId","createdById","createdAt","updatedById","updatedAt","deletedById","deletedAt") VALUES
	 (1,'Admin','daniel@epicquestti.com.br','16991636055',NULL,NULL,'https://www.kasandbox.org/programming-images/avatars/primosaur-sapling.png',NULL,NULL,NULL,NULL,NULL,NULL,NULL);

INSERT INTO dev3."PaymentModifiers" ("name") VALUES
	 ('Desconto direto R$'),
	 ('Desconto percentual %'),
	 ('Acréscimo direto R$'),
	 ('Acréscimo percentual %');