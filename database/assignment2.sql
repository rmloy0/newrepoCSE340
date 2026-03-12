INSERT into public.account (
account_firstname,
account_lastname,
    account_email  ,
    account_password 
)
VALUES (
'Tony', 
'Stark',
'tony@starkent.com',
'Iam1ronM@n'
);

UPDATE  public.account 
SET account_type = 'Admin'
WHERE account_id =2;
 

DELETE FROM public.account 
WHERE account_id = 2;



UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors','a huge interior')
WHERE inv_id = 10;



SELECT inventory.inv_model,  classification.classification_name FROM public.inventory
 
INNER JOIN public.classification ON classification.classification_id = inventory.classification_id
WHERE inventory.classification_id = 2;



UPDATE public.inventory
SET inv_image = REPLACE(inv_image,  '/images/','/images/vehicles/'),  
 inv_thumbnail = REPLACE(inv_thumbnail,  '/images/','/images/vehicles/');